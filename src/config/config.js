/**
 * Global configure
 */

const CONFIG = {

	HOST: process.env.HOST,

	DICT_HOST: process.env.DICT_HOST,

	isFetch: true,

	isDebug: process.env.NODE_ENV === 'development',

	timeoutDeadline: 30000,

	sysType: 1,

	appKey: '123456',

	cloudId: 2,

	// 客户类型
	clientTypes: ['个人', '机构'],

	// 账号类型
	accountTypes: ['身份证号', '护照号', '手机号', '邮箱', '微信号', '微博号', 'QQ号', '工商注册号', '组织机构代码', '部门代码', '订单号', '产品号', '服务请求号', '内部账号', 'OpenId'],

	// 权限管理
	AUTHOR_MANAGE: '/distribution-system-management/sm',

	// 产品管理
	PRODUCT_MANAGE: '/distribution-product/pt',

	// 字典查询
	DICT_MANAGE: '/sp-distribution/sp',

	// 分销商管理
	DISTRIBUTION_SYSTEM_MANAGE: '/distribution-distribution-system/ds',

	// 供应商
	SUPPLIERS: { 2: '尚品' },

	// 首页名称
	DASHBOARD_NAME: '分销概况',

	// 非销售类职位
	POSITION_TYPE_IS_NOT_SALESMAN: 2,

	// 其它职级
	OTHER_POSITION_LEVEL: [6],

	// ACCESS_TOKEN key
	ACCESS_TOKEN: 'sp_distribution_access_token',

	// 分销退出接口
	SP_LOGOUT_URL: 'http://sp.fx.dev.fingercrm.cn/distribution-web/channels/sp/user/pc/logout.do'
}

Object.freeze(CONFIG)

export default CONFIG
