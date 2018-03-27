const SERVERS = {
	development: {
		base: 'http://sp.test.fingercrm.cn',
		dict: 'http://sp.test.fingercrm.cn'
	},
	sit: {
		base: 'http://sp.dev.fingercrm.cn',
		dict: 'http://sp.dev.fingercrm.cn'
	},
	test: {
		base: 'http://sp.test.fingercrm.cn',
		dict: 'http://sp.test.fingercrm.cn'
	},
	uat: {
		base: 'http://k8s.sp.fingercrm.cn',
		dict: 'http://k8s.sp.fingercrm.cn'
	},
	production: {
		base: 'http://47.96.27.228:8081',
		dict: 'http://47.96.27.228:8081'
	}
}

module.exports = {
	HOST: SERVERS[process.env.NODE_ENV].base,

	DICT_HOST: SERVERS[process.env.NODE_ENV].dict,

	devPublicPath: '/',

	prodPublicPath: '/',

	inlineFileLimit: 1000,

	autoOpenBrowser: false,

	productionSourceMap: true,

	enableReactHot: true,

	cssModulesSetting: '?modules&localIdentName=[name]__[local]-[hash:base64:5]',

	providePlugin: {},

	proxy: {
		"/api": {
			target: "http://localhost:5000",
			secure: false,
			pathRewrite: {
				"^/api": ""
			}
		}
	}
}
