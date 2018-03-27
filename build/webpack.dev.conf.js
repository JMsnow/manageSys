var utils = require('./utils')
var CONFIG = require('./config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConf = require('./webpack.base.conf')

var webpackConfig = merge(baseWebpackConf, {
	output: {
		filename: '[name][hash].js',
		path: utils.resolvePath('dist'),
		publicPath: CONFIG.devPublicPath,
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify('development'),
				HOST: JSON.stringify(CONFIG.HOST),
				DICT_HOST: JSON.stringify(CONFIG.DICT_HOST)
			}
		}),
		new webpack.ProvidePlugin(CONFIG.providePlugin),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new FriendlyErrorsWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: utils.resolvePath('index.html'),
			filename: 'index.html',
			inject: true
		})
	],
	devServer: {
		proxy: CONFIG.proxy,
		historyApiFallback: true,
		hot: true,
		inline: true,
		open: CONFIG.autoOpenBrowser,
		stats: 'none',
		// port: 9000
	},
	devtool: '#cheap-module-eval-source-map'
})

module.exports = webpackConfig
