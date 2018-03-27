/*
 * ACTIONS Command
 */

const ACTIONIDS_CMD = {
	USER_CREATE: 'A_1101',
	USER_ADD_ROLE: 'A_1102',
	USER_DELETE: 'A_1103',
	USER_ROLE_DEL: 'A_1104',
	USER_DETAIL: 'A_1105',
	USER_STOP: 'A_1106',
	USER_ACTIVE: 'A_1107',
	USER_LIST: 'A_1108',
	USER_MODIFY: 'A_1109',
	USER_ROLE_MODIFY: 'A_1110',

	POSITION_CREATE: 'A_2101',
	POSITION_STOP: 'A_2106',
	POSITION_ACTIVE: 'A_2105',
	POSITION_DETAIL: 'A_2104',
	POSITION_MODIFY: 'A_2108',
	POSITION_DELETE: 'A_2103',
	POSITION_ROLE_ADD: 'A_2118',
	POSITION_ROLE_DEL: 'A_2119',
	POSITION_ROLE_MODIFY: 'A_2122',
	POSITION_STAFF_ADD: 'A_2113',
	POSITION_STAFF_DEL: 'A_2114',
	POSITION_STAFF_MODIFY: 'A_2117',

	ROLE_CREATE: 'A_1114',
	ROLE_STOP: 'A_1116',
	ROLE_ACTIVE: 'A_1117',
	ROLE_DETAIL: 'A_1115',
	ROLE_MODIFY: 'A_1119',
	ROLE_DELETE: 'A_1127',
	ROLE_FUN_ADD: 'A_1125',
	ROLE_FUN_DEL: 'A_1123',

	MENU_CREATE: 'A_4101',
	MENU_DELETE: 'A_4102',
	MENU_MODIFY: 'A_4104',
	FUN_CREATE: 'A_4109',
	FUN_DELETE: 'A_4110',
	FUN_STOP: 'A_4112',
	FUN_ACTIVE: 'A_4108',
	FUN_MODIFY: 'A_4114',

	DEPT_CREATE: 'A_5101',
	DEPT_DELETE: 'A_5102',
	DEPT_MODIFY: 'A_5104',
	DEPT_DETAIL: 'A_5109',


	CLIENT_CREATE: 'A_7400',
	CLIENT_DISABLE: 'A_7404',
	CLIENT_ENABLE: 'A_7405',
	CLIENT_DETAIL: 'A_7402',
	CLIENT_MODIFY: 'A_7401',
	CLIENT_DELETE: 'A_7403',

	STAFF_CREATE: 'A_3101',
	STAFF_DELETE: 'A_3103',
	STAFF_MODIFY: 'A_3109',
	STAFF_DETAIL: 'A_3105',
	STAFF_STOP: 'A_3106',
	STAFF_ACTIVE: 'A_3107',
	STAFF_POSITION_ADD: 'A_3102',
	STAFF_POSITION_MODIFY: 'A_3110',

	AGENT_SYS_CREATE: 'A_8400',
	AGENT_SYS_DETAIL: 'A_8404',
	AGENT_SYS_MODIFY: 'A_8402',
	AGENT_SYS_DELETE: 'A_8403',

	ORDER_DETAIL: 'A_10002',
	ORDER_MINE: 'A_10001',
	ORDER_TEAM: 'A_10003',
	ORDER_ORG: 'A_10004',
	ORDER_CROSS_ORG: 'A_10005',
	ORDER_ALL: 'A_10006',

	RULE_CREATE: 'A_11303',
	RULE_PUBLIC: 'A_11311',
	RULE_STOP: 'A_11312',
	RULE_DETAIL: 'A_11302',
	RULE_MODIFY: 'A_11304',
	RULE_AUDIT: 'A_11307',

	PRODUCT_CREATE: 'A_9002',
	PRODUCT_MODIFY: 'A_9003',
	PRODUCT_DETAIL: 'A_9004',
	PRODUCT_SHELF: 'A_9005',
	PRODUCT_UNSHELF: 'A_9006',

	AGENT_CREATE: 'A_11216',
	AGENT_MODIFY: 'A_11218',
	AGENT_DETAIL: 'A_11220',
	AGENT_FREEZE: 'A_11222',
	AGENT_UNFREEZE: 'A_11224',
	AGENT_CHECK: 'A_11102',
	UNAUDITED_AGENT_DETAIL: 'A_11104',

	REBATE_ABONDON: 'A_11402',
	REBATE_SETTLE: 'A_11403',
	REBATE_CALC: 'A_12103',
	RECAL_REBATE: 'A_12202',
	ORDER_RECLEAN: 'A_12302',
	REBATE_EXCEPTION_ORDER_DETAIL: 'A_12203',
	REBATE_ORDER_DELETE: 'A_12102'
}

Object.freeze(ACTIONIDS_CMD)

export default ACTIONIDS_CMD