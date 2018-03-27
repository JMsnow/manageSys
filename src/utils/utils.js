/*
 * Utility
 */

import {
	isArray,
	isNumber,
	isObject,
	isBoolean,
	debounce,
	remove,
	cloneDeep,
	flattenDeep
} from 'lodash'
import moment from 'moment'
import { Decimal } from 'decimal.js'

let instance = null

/* eslint-disable */
const getAncestories = (tree, nodeId, { children, id, ancestories }) => {
	const oldAncestories = ancestories
	const length = tree.length

	for (let index = 0; index < length; index += 1) {
		const data = tree[index]
		const childrens = data[children]

		if (data[id] == nodeId) {
			return ancestories
		}

		if (childrens && childrens.length) {
			ancestories.push(String(data[id]))
			const _ancestories = getAncestories(childrens, nodeId, { ancestories, id, children })

			if (_ancestories) {
				return _ancestories
			}
		}

		if (index == length - 1) {
			ancestories = oldAncestories
		}
	}
}

/* eslint-enable */

class Utils {
	constructor() {
		if (!instance) {
			instance = this
		} else {
			return instance
		}
	}

	debounce = debounce

	remove = remove

	flattenDeep = flattenDeep

	/**
	 * 是否支持facth
	 */
	hasFetch() {
		return self.fetch && CONFIG.isFetch
	}

	/**
	 * 设置localStorage
	 * @param {stirng} key
	 * @param {object} data
	 */
	setLocalData(key, data) {
		localStorage.setItem(key, isObject(data) ? JSON.stringify(data) : data)
	}

	/**
	 * 设置sessionStorage
	 * @param {stirng} key
	 * @param {object} data
	 */
	setSessionData(key, data) {
		sessionStorage.setItem(key, isObject(data) ? JSON.stringify(data) : data)
	}

	/**
	 * 获取localStorage
	 * @param {stirng} key
	 * @param {boolean} isParse 是否解析数据
	 */
	getLocalData(key, isParse) {
		return isBoolean(isParse) && isParse ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key)
	}

	/**
	 * 获取sessionStorage
	 * @param {stirng} key
	 * @param {boolean} isParse 是否解析数据
	 */
	getSessionData(key, isParse) {
		return isBoolean(isParse) && isParse ? JSON.parse(sessionStorage.getItem(key)) : sessionStorage.getItem(key)
	}

	/**
	 * 移除localStorage
	 * @param {[]|stirng} keys 为空则清空localStorage
	 */
	removeLocalData(...keys) {
		const keysArray = Object.keys(keys)

		if (keysArray.length) {
			keysArray.forEach((index) => {
				localStorage.removeItem(keys[index])
			})
		} else {
			localStorage.clear()
		}
	}

	/**
	 * 移除sessionStorage
	 * @param {[]|stirng} keys 为空则清空移除sessionStorage
	 */
	removeSessionData(...keys) {
		const keysArray = Object.keys(keys)

		if (keysArray.length) {
			keysArray.forEach((index) => {
				sessionStorage.removeItem(keys[index])
			})
		} else {
			sessionStorage.clear()
		}
	}

	/**
	 * 获取当前时间戳
	 */
	getTimestamp() {
		return Math.floor(Date.now() / 1000)
	}

	/**
	 * 格式化时间戳
	 * @param {string} timestamp
	 * @param {string} format
	 */
	timestampFormat(timestamp, format) {
		return moment.unix(timestamp / 1000).format(format)
	}

	/**
	 * 获取指定的url查询参数值
	 * @param {string} pname 参数名称
	 * @param {string} purl url地址，默认为当前url地址
	 */
	getParameterByName(pname, purl) {
		let name = pname
		let url = purl

		if (!url) url = window.location.href

		name = name.replace(/[[\]]/g, '\\$&')

		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
		const results = regex.exec(url)

		if (!results) return null
		if (!results[2]) return ''

		return decodeURIComponent(results[2].replace(/\+/g, ' '))
	}

	extractParameterByName(pname, purl) {
		let url = purl

		if (!url) url = window.location.href

		const name = pname.replace(/[[\]]/g, '\\$&')

		const regex = new RegExp(`[?&]${name}(=([^&]*)|&|$)`)
		const results = regex.exec(url)

		if (!results) return null
		if (!results[2]) return ''

		return decodeURIComponent(results[2].replace(/\+/g, ' '))
	}

	/**
	 * 数组去重
	 * @param {array} arr
	 */
	unique(arr) {
		return Array.from(new Set(arr))
	}

	/**
	 * 深度冻结对象
	 * @param {object} o
	 */
	deepFreeze(o) {
		Object.freeze(o)

		Object.keys(o).forEach((item) => {
			if (typeof item === 'object' && !Object.isFrozen(item)) {
				this.deepFreeze(item)
			}
		})
	}

	removeItemArray(array, index) {
		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		return [
			...array.slice(0, index),
			...array.slice(index + 1)
		]
	}

	insertItemArray(array, item, index) {
		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		return [
			...array.slice(0, index),
			item,
			...array.slice(index)
		]
	}

	_moveItemArray(array, from, to) {
		const _array = [...array]

		_array.splice(to, 0, _array.splice(from, 1)[0])

		return _array
	}

	upMoveItemArray(array, index) {
		const that = this

		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		const from = index
		const to = index - 1

		return that._moveItemArray(array, from, to)
	}

	downMoveItemArray(array, index) {
		const that = this

		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		const from = index
		const to = index + 1

		return that._moveItemArray(array, from, to)
	}

	removeItemObject(obj, id) {
		if (!isObject(obj)) {
			debug.throw('Param is not object.')
		}

		const _obj = { ...obj }
		delete _obj[id]

		return _obj
	}

	/**
	 * 数组格式转树状结构
	 * @param   {array}     array
	 * @param   {String}    id
	 * @param   {String}    pid
	 * @param   {String}    children
	 * @return  {Array}
	 */
	arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
		const data = cloneDeep(array)
		const result = []
		const hash = {}

		data.forEach((item, index) => {
			hash[data[index][id]] = data[index]
		})

		data.forEach((item) => {
			const hashVP = hash[item[pid]]
			if (hashVP) {
				if (!hashVP[children]) {
					hashVP[children] = []
				}

				hashVP[children].push(item)
			} else {
				result.push(item)
			}
		})

		return result
	}

	queryArray(array, key, keyAlias = 'key') {
		if (!(array instanceof Array)) {
			return null
		}

		const item = array.filter(_ => _[keyAlias] === key)

		if (item.length) {
			return item[0]
		}

		return null
	}
	/**
	* 根据id获取所有的父节点
	* @param {array} treeData
	* @param {String} nodeId
	* @param {Object} {Optional}
	* @return {Array}
	*/
	getAncetoriesFromTreeData(treeData, nodeId, { children = 'children', id = 'id', ancestories = [] } = {}) {
		return getAncestories(treeData, nodeId, { children, id, ancestories })
	}

	/**
	 *  加法运算
	 *  @param {Number} num1
	 *  @param {Number} num2
	 *  @param {Number} precision(精度)
	 */
	add(num1 = 0, num2 = 0, precision = 2) {
		if (!isNumber(num1) || !isNumber(num2) || !isNumber(precision)) {
			throw new Error('expect number!')
		}
		return +(new Decimal(num1).add(num2).toFixed(precision))
	}

	/**
	 *  乘法运算
	 *  @param {Number} num1
	 *  @param {Number} num2
	 *  @param {Number} precision(精度)
	 */
	mul(num1 = 0, num2 = 0, precision = 2) {
		if (!isNumber(num1) || !isNumber(num2) || !isNumber(precision)) {
			throw new Error('expect number!')
		}
		return +(new Decimal(num1).times(num2).toFixed(precision))
	}

	getAncestriesFromArray(array, route, { pid = 'pid' } = {}) {
		const data = array.find(_ => route.indexOf(_.route) > -1)
		const ancestries = []

		if (!data) return ancestries

		ancestries.push(data)

		let parentId = data[pid]

		while (parentId) {
			const parent = array.find(_ => _.id === parentId)

			if (parent) {
				ancestries.unshift(parent)
				parentId = parent[pid]
			} else {
				parentId = null
			}
		}

		return ancestries
	}
}

export default Utils
