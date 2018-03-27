/*
 * JavaScript normalize
 */

// Promise
if (!window.Promise) {
	window.Promise = require('promise-polyfill')
}

// Fetch
if (!window.fetch) {
	require('whatwg-fetch')
}

// FormData
if (!window.FormData) {
	require('form-data')
}

// Object assign
Object.assign = require('object-assign')
