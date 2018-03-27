var utils = require('./utils')
var CONFIG = require('./config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CompressionWebpackPlugin = require('compression-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')

var pathsToClean = [
	utils.resolvePath('dist')
]

var webpackConfig = merge(baseWebpackConfig, {
	output: {
		filename: 'js/[name].[chunkhash].js',
		path: utils.resolvePath('dist'),
		publicPath: CONFIG.prodPublicPath,
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify('production'),
				HOST: JSON.stringify(CONFIG.HOST),
				DICT_HOST: JSON.stringify(CONFIG.DICT_HOST)
			}
		}),
		new ExtractTextPlugin({
			filename: 'css/[name].[contenthash].css',
			disable: false,
			allChunks: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			comments: false,
			sourceMap: true
		}),
		new CleanWebpackPlugin(pathsToClean, {
			root: utils.resolvePath('')
		}),
		new HtmlWebpackPlugin({
			template: utils.resolvePath('index.html'),
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			},
			chunksSortMode: 'dependency'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: function (module) {
				if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
					return false
				}
				return module.context && module.context.indexOf(utils.resolvePath('node_modules')) !== -1
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest",
			minChunks: Infinity
		}),
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(js|css)$'
			),
			threshold: 10240,
			minRatio: 0.8
		}),
		new CopyWebpackPlugin([{
			from: utils.resolvePath('src/assets'),
			to: utils.resolvePath('dist/assets'),
			ignore: ['.*']
		}])
	],
	devtool: CONFIG.ProductionSourceMap ? '#source-map' : false
});

module.exports = webpackConfig
