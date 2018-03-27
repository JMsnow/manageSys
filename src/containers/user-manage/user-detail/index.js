import React, { Component } from 'react'
import { Table, Row, Col, Divider, message } from 'antd'
import { Route } from 'react-router-dom'
import AuthBtn from 'components/auth-button'
import ModifyRole from '../modify-role'
import SetRole from '../add-set-roles'

const DetailItem = props => (
	<Col span={8}>
		<span>{props.label}：</span>
		<span style={{ color: 'rgba(0,0,0,0.5)' }}>{props.children}</span>
	</Col>
)

class UserDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			roleListData: [],
			userDetailData: {},
			tableLoading: false
		}
	}
	componentWillMount() {
		const userId = this.props.match.params.userId
		request.send(HTTP_CMD.USER_DETAIL, { userId }).then((res) => {
			this.setState({ userDetailData: res.data })
		})
		this._getUserRoles()
	}
	_getUserRoles = () => {
		const userId = this.props.match.params.userId
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.USER_ROLE, { userId }).then((res) => {
			this.setState({ tableLoading: false })
			const roleListData = res.data.map(item => ({ ...item, key: item.roleId }))
			this.setState({ roleListData })
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}
	handleUserAddRole = (roleIdList, that) => { // 传给添加角色组件执行
		that.setState({ confirmLoading: true })
		request.send(HTTP_CMD.USER_ROLE_ADD, { userId: this.state.userDetailData.userId, roleIdList }).then((res) => {
			that.setState({ confirmLoading: false })
			this._getUserRoles()
			message.success(res.msg)
			that.props.history.goBack()
		}).catch(() => that.setState({ confirmLoading: false }))
	}
	handleAddRole = () => { // 点击添加角色按钮
		this.props.history.push({
			pathname: `${this.props.match.url}/set-role`,
			userDetailData: this.state.userDetailData,
			roleListData: this.state.roleListData
		})
	}
	handleModifyRole = record => () => { // 修改用户角色
		const roleData = { record, userDetailData: this.state.userDetailData }
		this.props.history.push({
			pathname: `${this.props.match.url}/modify-role`,
			roleData
		})
	}
	handleViewRole = (roleId) => {
		this.props.history.push(`/app/role-manage/role-detail/${roleId}`)
	}
	handleModify = () => { // 往编辑用户
		const userId = this.props.match.params.userId
		this.props.history.push(`/app/user-manage/user-modify/${userId}`)
	}
	handleDelRole = record => () => {
		helper.confirm('确定删除该角色吗').then(() => {
			request.send(HTTP_CMD.USER_ROLE_DELETE, { roleId: record.roleId, userId: this.state.userDetailData.userId })
				.then((res) => {
					message.success(res.msg)
					this._getUserRoles()
				})
		})
	}
	render() {
		const { userDetailData } = this.state
		const columns = [
			{
				title: '角色名称',
				dataIndex: 'roleName',
				width: '19%'
			},
			{
				title: '角色描述',
				dataIndex: 'roleDesc',
				width: '19%'
			},
			{
				title: '当前状态',
				dataIndex: 'roleStatus',
				width: '19%',
				render: (text) => {
					switch (text) {
					case 1 :
						return <span className='helper__color_green'>激活</span>
					case 0 :
						return <span className='helper__color_red'>停用</span>
					default :
						return ''
					}
				}
			},
			{
				title: '失效日期',
				dataIndex: 'endDt2',
				width: '19%'
			},
			{
				title: '操作',
				dataIndex: 'roleId',
				width: '24%',
				render: (roleId, record) => (
					<div>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => this.handleViewRole(roleId)} actionId={ACTIONIDS_CMD.ROLE_DETAIL}>查看</AuthBtn>
						<AuthBtn style={{ marginRight: 10 }} onClick={this.handleModifyRole(record)} actionId={ACTIONIDS_CMD.USER_ROLE_MODIFY}>修改</AuthBtn>
						<AuthBtn onClick={this.handleDelRole(record)} actionId={ACTIONIDS_CMD.USER_ROLE_DEL}>删除</AuthBtn>
					</div>
				)
			}
		]
		return (
			<div>
				<div className='g__block_flex_space-between'>
					<span style={{ fontSize: 16, color: '#000' }}>用户详情</span>
					<AuthBtn
						type='primary'
						onClick={this.handleModify}
						actionId={ACTIONIDS_CMD.USER_MODIFY}
					>
						编辑用户
					</AuthBtn>
				</div>
				<Row style={{ lineHeight: 2.5, marginTop: 10 }}>
					<DetailItem label='用户账号'>{userDetailData.loginName}</DetailItem>
					<DetailItem label='账号类型'>{CONFIG.accountTypes[+userDetailData.loginType]}</DetailItem>
					<DetailItem label='状态'>{userDetailData.userStatus === 1 ? '激活' : '停用'}</DetailItem>
					<DetailItem label='是否员工'>{userDetailData.isInternalUser ? '是' : '否'}</DetailItem>
					<DetailItem label='员工'>{userDetailData.employeeName || '未关联员工'}</DetailItem>
					<DetailItem label='最近登录时间'>{userDetailData.lastUseDt}</DetailItem>
					<DetailItem label='最近登录IP'>{userDetailData.lastUseIp}</DetailItem>
					<DetailItem label='创建日期'>{userDetailData.createDt}</DetailItem>
					<DetailItem label='创建者'>{userDetailData.creator}</DetailItem>
					<DetailItem label='更新日期'>{userDetailData.updateDt}</DetailItem>
					<DetailItem label='更新者'>{userDetailData.updater}</DetailItem>
				</Row>
				<Divider />
				<div>
					<div className='g__block_flex_space-between'>
						<span style={{ fontSize: 16, color: '#000' }}>{userDetailData.loginName}的角色</span>
						<AuthBtn type='primary' onClick={this.handleAddRole} actionId={ACTIONIDS_CMD.USER_ADD_ROLE}>
							添加角色
						</AuthBtn>
					</div>
					<Table
						style={{ marginTop: 15 }}
						loading={this.state.tableLoading}
						columns={columns}
						dataSource={this.state.roleListData}
						pagination={false}
						scroll={{ y: 400 }}
					/>
				</div>
				<Route path={`${this.props.match.path}/modify-role`} render={props => <ModifyRole {...props} onOk={this._getUserRoles} />} />
				<Route path={`${this.props.match.path}/set-role`} render={props => <SetRole {...props} onOk={this.handleUserAddRole} />} />
			</div>
		)
	}
}
export default UserDetail
