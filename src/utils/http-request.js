/** global window */
/* global location */

/*
 * HTTP Requset
 */
import { message } from 'antd'

let instance
let requestHandler = null

const getReqUrl = reqName => `${helper.getRequestHost(reqName)}${reqName}`

/**
* 处理session 失效
*/
const handle104Error = () => {
	utils.removeLocalData()
	const {
		pathname,
		search
	} = window.location
	const from = encodeURIComponent(`${pathname}${search}`)
	window.location = `${location.origin}/auth/login?from=${from}`
}

/**
 * Fetch check status
 */
const checkStatus = (response) => {
	if (response.status >= 200 && response.status < 300) {
		return response
	}

	message.error(`Status: ${response.status} Message: ${response.statusText}`)

	const error = new Error(response.statusText)
	error.response = response
	throw error
}

/**
 * Fetch parse JSON
 */
const parseJSON = response => response.json()

class HttpRequest {
	constructor() {
		if (!instance) {
			instance = this
		} else {
			return instance
		}

		this._init()
	}

	_init() {
		if (utils.hasFetch()) {
			requestHandler = fetch
		} else {
			requestHandler = require('superagent')
		}
	}

	fetchRequest({ reqName, reqData }) {
		const accessToken = utils.getLocalData(CONFIG.ACCESS_TOKEN)
		return requestHandler(getReqUrl(reqName), {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify(reqData)
		}).then(checkStatus).then(parseJSON).then(this.authResponse)
	}

	fetchUpload({ reqName, file }) {
		const formData = new FormData()
		const datas = helper.signUploadData()
		const keys = Object.keys(datas)
		formData.append('file', file)

		keys.forEach((key) => {
			formData.append(key, datas[key])
		})

		return requestHandler(getReqUrl(reqName), {
			method: 'POST',
			body: formData
		}).then(checkStatus).then(parseJSON).then(this.authResponse)
	}

	ajaxRequest({ reqName, reqData }) {
		return new Promise((resolve, reject) => {
			requestHandler
				.post(getReqUrl(reqName))
				.timeout({
					deadline: CONFIG.timeoutDeadline
				})
				.set('Content-Type', 'application/json')
				.send(JSON.stringify(reqData))
				.end((err, res) => {
					if (err || !res.ok) {
						if (err.timeout) {
							message.error('请求超时，请重试。')
						} else {
							message.error(`Status: ${err.status} Message: ${err.message}`)
						}
						reject(err)
					} else {
						const body = JSON.parse(res.text)

						if (+body.code === 104) {
							handle104Error()
						}

						if (+body.code < 200 || +body.code > 299) {
							message.error(`${body.code}: ${body.msg}`)
							reject(body)
						} else {
							resolve(body)
						}
					}
				})
		})
	}

	ajaxUpload({ reqName, file }) {
		const datas = helper.signUploadData()
		const keys = Object.keys(datas)

		return new Promise((resolve, reject) => {
			requestHandler.attach('file', file)

			keys.forEach((key) => {
				requestHandler.field(key, datas[key])
			})

			requestHandler
				.post(getReqUrl(reqName))
				.timeout({
					deadline: CONFIG.timeoutDeadline
				})
				.end((err, res) => {
					if (err || !res.ok) {
						if (err.timeout) {
							message.error('请求超时，请重试。')
						} else {
							message.error(`Status: ${err.status} Message: ${err.message}`)
						}
						reject(err)
					} else {
						const body = JSON.parse(res.text)

						if (+body.code === 104) {
							handle104Error()
						}

						if (+body.code < 200 || +body.code > 299) {
							message.error(`${body.code}: ${body.msg}`)
							reject(body)
						} else {
							resolve(body)
						}
					}
				})
		})
	}

	authResponse(res) {
		return new Promise((resolve, reject) => {
			if (+res.code === 104) {
				handle104Error()
			}

			if (+res.code < 200 || +res.code > 299) {
				message.error(`${res.code}: ${res.msg}`)
				reject(res)
			} else {
				resolve(res)
			}
		})
	}

	send(reqName, reqData = {}) {
		const that = this

		const args = {
			reqName,
			reqData: helper.signRequestData(reqData, reqName)
		}

		return utils.hasFetch() ? that.fetchRequest(args) : that.ajaxRequest(args)
	}

	upload(reqName, file) {
		const params = {
			reqName,
			file
		}

		return utils.hasFetch() ? this.fetchUpload(params) : this.ajaxUpload(params)
	}
}

export default HttpRequest
