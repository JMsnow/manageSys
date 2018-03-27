/*
 * Debug
 */
import { isFunction, isObject } from 'lodash'

let instance = null

class Debug {
	constructor() {
		if (!instance) {
			instance = this
		} else {
			return instance
		}

		this.generateDebugger()
	}

	generateDebugger() {
		/* eslint no-console: "off" */
		Object.keys(console).forEach((key) => {
			if (isFunction(console[key]) && CONFIG.isDebug) {
				this[key] = console[key].bind(window.console)
			} else {
				this[key] = () => {}
			}
		})
	}

	/**
	 * Throws a user-defined exception
	 */
	throw(obj) {
		throw isObject(obj) ? obj : new Error(obj)
	}
}

export default Debug
