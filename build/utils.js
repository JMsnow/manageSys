var path = require('path')
var CONFIG = require('./config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.resolvePath = function (dir) {
	return path.resolve(__dirname, '..', dir)
}

exports.getMainEntryConf = function () {
	var arr = [
		exports.resolvePath('src/app.js'),
		'babel-polyfill'
	]

	var reactHotConf = [
		'react-hot-loader/patch'
	]

	return CONFIG.enableReactHot ? reactHotConf.concat(arr) : arr
}

exports.getCssRuleConf = function (isEnableModules) {
	var cssLoaderStr = isEnableModules ? 'css-loader' + CONFIG.cssModulesSetting : 'css-loader'

	var devConf = [
		'style-loader',
		cssLoaderStr,
		'postcss-loader',
		'sass-loader'
	]

	var prodConf = ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: [cssLoaderStr, 'postcss-loader', 'sass-loader'],
		publicPath: CONFIG.prodPublicPath
	})

	return process.env.NODE_ENV === 'development' ?  devConf : prodConf
}
