/*
 * HTTP Command
 */

const HTTP_CMD = {
	/**
	 * 用户登录
	 */

	// 用户登录
	USER_LOGIN: '/distribution-system-management/sm/user/login',

	// 用户登出
	USER_LOGOUT: '/distribution-system-management/sm/user/logout',

	// 用户权限
	USER_AUTH: '/distribution-system-management/sm/user/auth',

	/**
	 * 功能管理
	 */

	// 菜单树型列表
	MENU_TREE: '/distribution-system-management/sm/menuTree/tree',

	// 查询操作列表
	FEATURE_LIST: '/distribution-system-management/sm/functionPageAction/list',

	// 停用操作功能
	STOP_ACTION: '/distribution-system-management/sm/functionPageAction/inactive',

	// 激活操作功能
	START_ACTION: '/distribution-system-management/sm/functionPageAction/active',

	// 添加操作
	ADD_ACTION: '/distribution-system-management/sm/functionPageAction/add',

	// 删除操作
	DEL_ACTION: '/distribution-system-management/sm/functionPageAction/delete',

	// 修改操作
	MODIFY_ACTION: '/distribution-system-management/sm/functionPageAction/modify',

	// 查看操作详情
	DETAIL_ACTION: '/distribution-system-management/sm/functionPageAction/detail',

	// 添加菜单
	ADD_MENU: '/distribution-system-management/sm/menuTree/add',

	// 删除菜单
	DEL_MENU: '/distribution-system-management/sm/menuTree/delete',

	// 修改菜单
	MODIFY_MENU: '/distribution-system-management/sm/menuTree/modify',

	// 查看菜单详情
	DETAIL_MENU: '/distribution-system-management/sm/menuTree/detail',

	/**
	 * 部门管理
	 */

	// 创建部门
	CREATE_DEPT: '/distribution-system-management/sm/dept/create',

	// 修改部门
	MODIFY_DEPT: '/distribution-system-management/sm/dept/modify',

	// 查询部门
	DEPT_LIST: '/distribution-system-management/sm/dept/list',

	// 查询所有部门
	DEPT_LIST_ALL: '/distribution-system-management/sm/dept/listAll',

	// 查询所有部门(包含未生效的)
	DEPT_LIST_ALL_WITH: '/distribution-system-management/sm/dept/listAllWithoutPerioid',

	// 查询所有组织
	DEPT_LIST_ALL_ORG: '/distribution-system-management/sm/dept/listAllOrg',

	// 模糊搜索部门
	QUERY_DEPT: '/distribution-system-management/sm/dept/queryByDeptNameWithoutPerioid',

	// 删除部门
	DEL_DEPT: '/distribution-system-management/sm/dept/delete',

	// 部门详情
	DEPT_DETAIL: '/distribution-system-management/sm/dept/queryByDeptIdWithoutPerioid',

	// 部门待选择职位列表
	DEPT_SELECT_POSITION_LIST: '/distribution-system-management/sm/position/queryWithSelectByDept',

	// 部门绑定职位
	DEPT_BIND_POSITION: '/distribution-system-management/sm/position/bindDept',

	// 部门取消绑定职位
	DEPT_UNBIND_POSITION: '/distribution-system-management/sm/position/unbindDept',

	// 部门待选择员工列表
	DEPT_SELECT_EMPLOYEE_LIST: '/distribution-system-management/sm/employee/queryWithSelectEmployeeDeptId',

	// 部门绑定员工
	DEPT_BIND_EMPLOYEE: '/distribution-system-management/sm/position/bindDept',

	// 部门取消绑定员工
	DEPT_UNBIND_EMPLOYEE: '/distribution-system-management/sm/position/unbindDept',

	/**
	 * 员工管理
	 */

	// 创建员工
	CREATE_STAFF: '/distribution-system-management/sm/employee/create',

	// 修改员工
	MODIFY_STAFF: '/distribution-system-management/sm/employee/modify',

	// 查询员工列表
	STAFF_LIST: '/distribution-system-management/sm/employee/list',

	// 搜索员工列表(根据首字母查询)
	STAFF_LIST_QUERY: '/distribution-system-management/sm/employee/selectEmployList',

	// 查询是否已存在指定mobile的员工
	CHECK_MOBILE_EXISTED: '/distribution-system-management/sm/contact/detailForPhone',

	// 查询是否已存在指定邮箱的员工
	CHECK_EMAIL_EXISTED: '/distribution-system-management/sm/contact/detailForEmail',

	// 停用员工
	DISABLE_STAFF: '/distribution-system-management/sm/employee/disable',

	// 激活员工
	ENABLE_STAFF: '/distribution-system-management/sm/employee/enable',

	// 删除员工
	DEL_STAFF: '/distribution-system-management/sm/employee/del',

	// 员工详情
	STAFF_DETAIL: '/distribution-system-management/sm/employee/detail',

	// 查询员工职位列表
	STAFF_POSITION_LIST: '/distribution-system-management/sm/employee/queryEmployeePosittionList',

	// 移除员工关联的职位
	STAFF_REMOVE_POSTION: '/distribution-system-management/sm/employee/deleteEmployeePosittion',

	// 员工待选择职位列表
	STAFF_SELECT_POSITION_LIST: '/distribution-system-management/sm/employee/queryWithSelectPositionId',

	// 员工绑定职位
	STAFF_BIND_POSITION: '/distribution-system-management/sm/employee/createEmployeePosittion',

	// 员工取消绑定职位
	STAFF_UNBIND_POSITION: '/distribution-system-management/sm/employee/deleteEmployeePosittion',

	// 员工修改职位
	STAFF_MODIFY_POSITION: '/distribution-system-management/sm/employee/modifyEmployeePosittion',

	// 职位树异步加载
	// POSTION_TREE_ASYNC: '/distribution-system-management/sm/position/treeSync',

	POSTION_TREE_ASYNC: '/distribution-system-management/sm/position/treeAll',

	/**
	 * 用户管理
	 */

	// 创建用户
	CREATE_USER: '/distribution-system-management/sm/user/create',

	// 查询输入的用户账号是否存在
	QUERY_USER_ACCOUNT: '/distribution-system-management/sm/user/selectLoginNameIsExist',

	// 用户列表
	USER_LIST: '/distribution-system-management/sm/user/list',

	// 用户详情
	USER_DETAIL: '/distribution-system-management/sm/user/detail',

	// 用户停用
	USER_DISABLE: '/distribution-system-management/sm/user/disable',

	// 用户激活
	USER_ENABLE: '/distribution-system-management/sm/user/enable',

	// 用户删除
	USER_DEL: '/distribution-system-management/sm/user/del',

	// 编辑用户
	USER_MODIFY: '/distribution-system-management/sm/user/modify',

	// 查询用户关联角色
	USER_ROLE: '/distribution-system-management/sm/user/queryUserRoleList',

	// 查询用户可以关联的角色
	USER_ROLE_ENABLE: '/distribution-system-management/sm/role/roleListByUser',

	// 编辑用户角色
	USER_ROLE_MODIFY: '/distribution-system-management/sm/user/modifyUserRole',

	// 删除用户角色
	USER_ROLE_DELETE: '/distribution-system-management/sm/user/deleteUserRole',

	// 添加用户角色
	USER_ROLE_ADD: '/distribution-system-management/sm/user/createUserRole',

	// 创建用户选择员工
	USER_CREATE_SELETC_STAFF: '/distribution-system-management/sm/employee/selectEmployList',

	/**
	 * 角色管理
	 */

	// 角色列表
	ROLE_LIST: '/distribution-system-management/sm/role/list',

	// 角色停用
	ROLE_DISABLE: '/distribution-system-management/sm/role/disable',

	// 角色激活
	ROLE_ENABLE: '/distribution-system-management/sm/role/enable',

	// 角色详情
	ROLE_DETAIL: '/distribution-system-management/sm/role/detail',

	// 角色关联的功能
	ROLE_FUN: '/distribution-system-management/sm/role/queryRoleAndFunctionPageActionList',

	// 角色关联的功能增加
	ROLE_FUN_ADD: '/distribution-system-management/sm/rolePageAction/createRolePageAction',

	// 角色关联的功能删除
	ROLE_FUN_DELETE: '/distribution-system-management/sm/rolePageAction/deleteByMenuNodeIdAndActionId',

	// 角色关联的菜单增加
	ROLE_MENU_ADD: '/distribution-system-management/sm/roleFunction/createRoleFunction',

	// 角色关联的菜单删除
	ROLE_MENU_DELETE: '/distribution-system-management/sm/roleFunction/deleteRoleAndFunctionPageAction',

	// 角色创建
	ROLE_CREATE: '/distribution-system-management/sm/role/create',

	// 查询角色名是否重复
	IS_ROLE_REPEAT: '/distribution-system-management/sm/role/selectRoleNameIsExist',

	// 角色编辑
	ROLE_MODIFY: '/distribution-system-management/sm/role/modify',

	// 角色删除
	ROLE_DELETE: '/distribution-system-management/sm/role/del',

	/**
	 * 职位管理
	 */

	// 根据部门id获取职位列表
	POSITION_LIST: '/distribution-system-management/sm/position/list',

	// 停用职位
	POSITION_STOP: '/distribution-system-management/sm/position/inactive',

	// 激活职位
	POSITION_ACTIVE: '/distribution-system-management/sm/position/active',

	// 删除职位
	POSITION_DELETE: '/distribution-system-management/sm/position/delete',

	// 职位详情
	POSITION_DETAIL: '/distribution-system-management/sm/position/detail',

	// 创建职位
	POSITION_CREATE: '/distribution-system-management/sm/position/add',

	// 职位选择树
	POSITION_TREE: '/distribution-system-management/sm/position/tree',

	// 编辑职位
	POSITION_MODIFY: '/distribution-system-management/sm/position/modify',

	// 职位关联的角色列表
	POSITION_ROLE: '/distribution-system-management/sm/positionRole/roleList',

	// 职位关联的员工列表
	POSITION_STAFF: '/distribution-system-management/sm/emplyeePosition/employeeList',

	// 职位关联的角色删除
	POSITION_ROLE_DELETE: '/distribution-system-management/sm/positionRole/roleDelete',

	// 职位关联的角色增加
	POSITION_ROLE_ADD: '/distribution-system-management/sm/positionRole/roleAdd',

	// 职位关联的角色修改
	POSITION_ROLE_Modify: '/distribution-system-management/sm/positionRole/roleModify',

	// 职位关联的员工增加
	POSITION_STAFF_ADD: '/distribution-system-management/sm/emplyeePosition/employeeAdd',

	// 职位关联的员工删除
	POSITION_STAFF_DELETE: '/distribution-system-management/sm/emplyeePosition/employeeDelete',

	// 职位关联的员工修改
	POSITION_STAFF_MODIFY: '/distribution-system-management/sm/emplyeePosition/employeeModify',

	// 职位选择员工
	POSITION_SELECT_STAFF: '/distribution-system-management/sm/emplyeePosition/chooseEmployeeList',

	// 职位选择角色
	POSITION_SELECT_ROLE: '/distribution-system-management/sm/positionRole/chooseRoleList',

	/**
	 * 客户管理
	 */

	// 我的客户
	CLIENT_MINE: '/distribution-system-management/sm/customer/myList',

	// 我团队的客户
	CLIENT_MINE_TEAM: '/distribution-system-management/sm/customer/myTeamList',

	// 所有客户
	CLIENT_ALL: '/distribution-system-management/sm/customer/allList',

	// 我组织的客户
	CLIENT_MINE_ORG: '/distribution-system-management/sm/customer/geOrgList',

	// 跨组织的客户
	CLIENT_ORG: '/distribution-system-management/sm/customer/getOrgCrossList',

	// 客户详情
	CLIENT_DETAIL: '/distribution-system-management/sm/customer/detail',

	// 创建客户
	CREATE_CLIENT: '/distribution-system-management/sm/customer/create',

	// 查询识别码编号是否重复
	IDCODE_ISEXIST: '/distribution-system-management/sm/customer/idCodeIsExist',

	// 编辑客户
	CLIENT_MODIFY: '/distribution-system-management/sm/customer/modify',

	// 选择负责人下拉框
	SELECT_PRINCIPAL: '/distribution-system-management/sm/employee/chooseEmployeePositionList',

	// 选择个人下拉框
	SELECT_PERSON: '/distribution-system-management/sm/contact/selectContactList',

	// 客户停用
	CLIENT_DISABLE: '/distribution-system-management/sm/customer/disable',

	// 客户激活
	CLIENT_ENABLE: '/distribution-system-management/sm/customer/enable',

	// 客户删除
	CLIENT_DELETE: '/distribution-system-management/sm/customer/del',

	/**
	* 产品管理
	*/

	// 我的产品
	PRODUCT_MINE: '/distribution-product/pt/product/mine',

	// 跨组织的产品
	PRODUCT_CROSSORG: '/distribution-product/pt/product/crossOrg',

	// 根据id取列表
	PRODUCT_BY_ID: '/distribution-product/pt/product/listByProductIdList',

	// 我组织的产品
	PRODUCT_MINE_ORG: '/distribution-product/pt/product/myOrg',

	// 我团队的产品
	PRODUCT_MINE_TEAM: '/distribution-product/pt/product/team',

	// 所有产品
	PRODUCT_ALL: '/distribution-product/pt/product/all',

	// 所有产品
	PRODUCT_LIST: '/distribution-product/pt/product/list',

	// 创建产品
	PRODUCT_CREATE: '/distribution-product/pt/product/add',

	// 修改产品
	PRODUCT_UPDATE: '/distribution-product/pt/product/modify',

	// 删除产品
	PRODUCT_DELETE: '/distribution-product/pt/product/del',

	// 产品详情
	PRODUCT_DETAIL: '/distribution-product/pt/product/detail',

	// 产品上架
	PRODUCT_SHELF: '/distribution-product/pt/product/shelf',

	// 产品下架
	PRODUCT_UNSHELF: '/distribution-product/pt/product/unshelf',

	// 产品图片上传
	PRODUCT_UPLOAD: '/distribution-product/pt/img/upload',

	// 根据productIdList获取多个product
	PRODUCT_COLLECTION: '/distribution-product/pt/product/listByProductIdList',


	/**
	* 字典表
	*/

	// 字典表
	DICT_LIST: '/distribution-system-management/sp/valueList/list',

	/**
	 * 分销体系管理
	 */

	// 分销体系列表
	DISTRIBUTION_SYS_LIST: '/distribution-distribution-system/ds/agentProgram/list',

	// 创建分销体系
	DISTRIBUTION_SYS_CREATE: '/distribution-distribution-system/ds/agentProgram/create',

	// 编辑分销体系
	DISTRIBUTION_SYS_MODIFY: '/distribution-distribution-system/ds/agentProgram/modify',

	// 分销体系详情
	DISTRIBUTION_SYS_DETAIL: '/distribution-distribution-system/ds/agentProgram/detail',

	// 删除分销体系
	DISTRIBUTION_SYS_DEL: '/distribution-distribution-system/ds/agentProgram/del',

	// 分销体系名称是否重复
	DISTRIBUTION_SYS_NAME_EXIST: '/distribution-distribution-system/ds/agentProgram/selectAgentProgramNameIsExist',

	/**
	 * 订单管理
	 */


	// 订单详情
	ORDER_DETAIL: '/distribution-order/order/detail',

	// 内部查看订单详情
	ORDER_DETAIL_INNER: '/distribution-order/order/detailForInner',

	// 我的订单
	ORDER_MINE: '/distribution-order/order/mine',

	// 我团队的订单
	ORDER_TEAM: '/distribution-order/order/team',

	// 我组织的订单
	ORDER_ORG: '/distribution-order/order/myOrg',

	// 跨组织的订单
	ORDER_CROSS_ORG: '/distribution-order/order/crossOrg',

	// 所有订单
	ORDER_ALL: '/distribution-order/order/all',

	/**
	 * 分佣规则管理
	 */

	RULES_LIST: '/distribution-commission-rule/cr/commisionRule/list',
	RULES_DETAIL: '/distribution-commission-rule/cr/commisionRule/detail',
	RULES_CREATE: '/distribution-commission-rule/cr/commisionRule/create',
	RULES_MODIFY: '/distribution-commission-rule/cr/commisionRule/modify',
	RULES_ITEM_CREATE: '/distribution-commission-rule/cr/commisionRuleItem/create',
	RULES_ITEM_DELETE: '/distribution-commission-rule/cr/commisionRuleItem/del',
	RULES_UPDATE_STATUS: '/distribution-commission-rule/cr/commisionRule/updateCommRuleStatus',
	RULES_AGENTS_PROGRAM: '/distribution-distribution-system/ds/agentProgram/chooseAgentProgram',
	COMM_CODE_EXIST: '/distribution-commission-rule/cr/commisionRule/isExistsCommRuleCode',
	RULES_ITEM_CODE_EXIST: '/distribution-commission-rule/cr/commisionRuleItem/isExistsCommRuleItemCode',

	// 规则试算
	RULES_TEST: '/sp-distribution/cr/commissionTransaction/preProcess',

	// 审核
	RULES_AUDIT: '/distribution-commission-rule/cr/commisionRule/auditOrTurnDown',

	// 根据体系获取组织
	RULES_ORG: '/distribution-distribution-system/ds/agentProgram/agentProgramForBoOrgList',

	/**
	* 代理人管理
	*/

	// 代理人列表
	AGENT_LIST: '/distribution-distributor/dd/agent/all',

	// 未审核代理人
	UNAUDITED_AGENT_LIST: '/distribution-distributor/dd/agent/listUncheck',

	// 创建代理人
	AGENT_CREATE: '/distribution-distributor/dd/agent/add',

	// 修改代理人
	AGENT_MODIFY: '/distribution-distributor/dd/agent/modify',

	// 代理人详情
	AGENT_DETAIL: '/distribution-distributor/dd/agent/detail',

	// 冻结代理人
	FREEZE_AGENT: '/distribution-distributor/dd/agent/freeze',

	// 解冻代理人
	UNFREEZE_AGENT: '/distribution-distributor/dd/agent/thaw',

	// 审核代理人
	AGENT_CHECK: '/distribution-distributor/dd/agent/check',

	// 所有代理人
	AGENT_ALL: '/distribution-distributor/dd/agent/all',

	// 我的代理人
	AGENT_MINE: '/distribution-distributor/dd/agent/mine',

	// 我团队的代理人
	AGENT_MINE_TEAM: '/distribution-distributor/dd/agent/team',

	// 我组织的代理人
	AGENT_MINE_ORG: '/distribution-distributor/dd/agent/myOrg',

	// 跨组织的代理人
	AGENT_CROSS_ORG: '/distribution-distributor/dd/agent/crossOrg',

	// 根据agentIdList获取多个agent
	AGENT_COLLECTION: '/distribution-distributor/dd/agent/listByAgentIdList',

	// 批量修改上级代理人
	AGENT_BATCH_UPDATE: '/distribution-distributor/dd/agent/modifyBatch',

	/**
	* 返佣结算明细
	*/

	// 分佣结算明细列表
	REBATE_LIST: '/sp-distribution/cr/commissionTransaction/list',

	// 我的分佣交易明细
	REBATE_MINE: '/sp-distribution/cr/commissionTransaction/mine',

	// 我组织的分佣交易明细
	REBATE_MINE_ORG: '/sp-distribution/cr/commissionTransaction/myOrg',

	// 我团队的分佣交易明细
	REBATE_MINE_TEAM: '/sp-distribution/cr/commissionTransaction/team',

	// 跨组织分佣交易明细
	REBATE_CROSS_ORG: '/sp-distribution/cr/commissionTransaction/crossOrg',

	// 所有分佣明细
	REBATE_ALL: '/sp-distribution/cr/commissionTransaction/all',

	// 分销结算明细行废弃
	REBATE_ABONDON: '/sp-distribution/cr/commissionTransaction/discard',

	// 代理人分佣记录列表
	AGENT_REBATE_LIST: '/sp-distribution/cr/commissionTransaction/selectRebateRecordPageList',

	// 分佣结算明细结算
	REBATE_SETTLE: '/sp-distribution/cr/commissionTransaction/getSettle',

	/**
	* 返佣处理
	*/
	// 订单明细列表
	REBATE_ORDER_LIST: '/distribution-order/order/orderItem/list',

	// 订单明细删除
	ORDER_DETAIL_DELETE: '/distribution-order/order/orderItem/delete',

	// 返佣异常数据列表
	REBATE_ABNORMAL_LIST: '/distribution-order/order/exceptionList',

	// 清洗异常数据列表
	ORDER_ABNORMAL_LIST: '/sp-distribution/dataSync/exceptionList',

	// 重新返佣
	RESET_REBATE: '/distribution-order/order/reCalculate',

	// 计算返佣
	CALC_REBATE: '/distribution-order/order/orderItem/calculate',

	// 重新清洗
	ORDER_RECLEAN: '/sp-distribution/dataSync/reClean'
}

Object.freeze(HTTP_CMD)

export default HTTP_CMD
