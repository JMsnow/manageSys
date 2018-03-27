var utils = require('./utils')
var CONFIG = require('./config')

var webpackConfig = {
	entry: {
		app: utils.getMainEntryConf()
	},
	module: {
		rules: [{
				// enforce: 'pre',
				// test: /\.(js|jsx)$/,
				// loader: 'eslint-loader',
				// include: [
				// 	utils.resolvePath('src'),
				// 	utils.resolvePath('build')
				// ]
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				include: utils.resolvePath('src')
			},
			{
				test: /\.(scss|less|css)$/,
				use: utils.getCssRuleConf(true),
				exclude: [
					utils.resolvePath('src/css'),
					utils.resolvePath('node_modules')
				]
			},
			{
				test: /\.(scss|less|css)$/,
				use: utils.getCssRuleConf(),
				include: [
					utils.resolvePath('src/css'),
					utils.resolvePath('node_modules')
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: CONFIG.inlineFileLimit,
					name: 'assets/images/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: CONFIG.inlineFileLimit,
					name: 'assets/fonts/[name].[hash:7].[ext]'
				}
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		alias: {
			'@': utils.resolvePath('src'),
			'react$': utils.resolvePath('node_modules/react/index.js'),
			'react-dom$': utils.resolvePath('node_modules/react-dom/index.js'),
			'components': utils.resolvePath('src/components'),
			'containers': utils.resolvePath('src/containers'),
			'states': utils.resolvePath('src/states'),
			'css': utils.resolvePath('src/css'),
			'utils': utils.resolvePath('src/utils'),
			'config': utils.resolvePath('src/config')
		}
	}
}

module.exports = webpackConfig
