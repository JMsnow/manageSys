/*
 * Helper business logic
 */
import { Modal } from 'antd'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import Md5 from 'crypto-js/md5'
// import SHA256 from 'crypto-js/sha256'
import { isString } from 'lodash'

let instance = null

const pathNameMap = {}

class Helper {
	constructor() {
		if (!instance) {
			instance = this
		} else {
			return instance
		}
	}

	signRequestData(data, reqName) {
		const tokenId = utils.getLocalData('tokenId') || ''

		if (this.hasLoginRequest(reqName)) {
			return {
				...data,
				[!data.contactId && 'loginPwd']: Md5(data.loginPwd).toString().toUpperCase()
			}
		}

		const timestamp = utils.getTimestamp()
		const base64ed = Base64.stringify(Utf8.parse(JSON.stringify(data)))
		const assesign = base64ed + CONFIG.appKey + timestamp + tokenId
		const sign = Md5(assesign).toString()

		return {
			sysType: CONFIG.sysType,
			appKey: CONFIG.appKey,
			cloudId: CONFIG.cloudId,
			timestamp,
			tokenId,
			sign,
			data
		}
	}

	signUploadData() {
		const tokenId = utils.getLocalData('tokenId') || ''
		const timestamp = utils.getTimestamp()
		const appKey = CONFIG.appKey
		const data = ''
		const base64ed = Base64.stringify(Utf8.parse(data))
		const assesign = base64ed + appKey + timestamp + tokenId
		const sign = Md5(assesign).toString()

		return {
			sysType: CONFIG.sysType,
			cloudId: CONFIG.cloudId,
			appKey,
			timestamp,
			tokenId,
			sign
		}
	}

	hasLoginRequest(reqName) {
		return reqName === HTTP_CMD.USER_LOGIN
	}

	hasDictRequest(reqName) {
		return reqName === HTTP_CMD.DICT_LIST
	}

	hasAuthenticated() {
		return utils.getLocalData('tokenId') && utils.getLocalData('authList')
	}

	createReducer(initialState, handlers) {
		return function reducer(state = initialState, action) {
			if ({}.hasOwnProperty.call(handlers, action.type)) {
				return handlers[action.type](state, action)
			}
			return state
		}
	}

	generateJsonTree = (sourceData) => {
		const pdata = {}
		const res = []

		sourceData.forEach((item) => {
			pdata[item.deptId] = item
		})

		sourceData.forEach((item) => {
			const pItem = item.orgChart && pdata[item.orgChart.fDeptId]

			if (pItem) {
				if (!pItem.children) pItem.children = []

				if (pItem.children.findIndex(_ => _.deptId === item.deptId) === -1) pItem.children.push(item)
			} else {
				res.push(item)
			}
		})

		return res
	}

	getRequestHost(reqName) {
		if (reqName.indexOf('/sp-distribution') > -1) return CONFIG.DICT_HOST

		if (reqName === CONFIG.SP_LOGOUT_URL) return ''

		return CONFIG.HOST
	}

	getAllActions(authList) {
		let actions = []
		const _getCurrentAction = (data) => {
			data.forEach((item) => {
				if (item.children) {
					_getCurrentAction(item.children)
				}
				actions = [...actions, ...(item.actionList || [])]
			})
		}
		_getCurrentAction(authList)
		return actions
	}

	confirm(content) {
		return new Promise((resolve) => {
			Modal.confirm({
				title: '提示',
				content,
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() { resolve() }
			})
		})
	}

	getLoginType(num = 0) {
		return CONFIG.loginTypes[+num]
	}

	/**
	 * 根据字段类别查询字段集合
	 * @param {string} fieldType
	 */
	queryAllFields(fieldType) {
		return new Promise((resolve, reject) => {
			if (!isString(fieldType)) {
				reject(new Error('缺少字段类别'))
			}
			if (window.FIELD_STORAGE && window.FIELD_STORAGE[fieldType] && window.FIELD_STORAGE[fieldType].length > 0) {
				resolve(window.FIELD_STORAGE[fieldType])
			} else {
				request.send(HTTP_CMD.DICT_LIST, { columnName: fieldType })
					.then((res) => {
						window.FIELD_STORAGE = window.FIELD_STORAGE || {}
						window.FIELD_STORAGE[fieldType] = res.data
						resolve(res.data)
					})
			}
		})
	}

	/**
	* 获取菜单数据
	*/
	getMenuData() {
		return [
			{
				id: -100,
				route: '/app/dashboard',
				name: CONFIG.DASHBOARD_NAME,
				menuIcon: 'home'
			},
			...this.getAuthMenuData()
		]
	}

	/**
	* 获取权限数据
	*/
	getAuthMenuData(parentId) {
		function addRouteKeys(pid, children, array = []) {
			children.forEach((item) => {
				const { functionUrl, menuNodeId, menuNodeName, menuIcon } = item
				const existItem = array.find(_ => _.id === menuNodeId)

				if (!existItem) {
					array.push({
						pid,
						menuIcon,
						id: menuNodeId,
						name: menuNodeName,
						route: functionUrl
					})
				}

				if (item.children) {
					addRouteKeys(menuNodeId, item.children, array)
				}
			})
		}

		const routeKeyArray = []
		const menuTreeData = utils.getLocalData('authList', true)
		addRouteKeys(parentId, menuTreeData, routeKeyArray)

		routeKeyArray.sort((a, b) => a.name.length - b.name.length)

		return routeKeyArray
	}

	/**
	* 路由名称表中插入一条entry
	*/
	addRouteNameEntry(route, name) {
		pathNameMap[route] = name
	}
}

export default Helper
