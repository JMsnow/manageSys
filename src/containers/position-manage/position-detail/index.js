import React, { Component } from 'react'
import { Table, Row, Col, Divider, message } from 'antd'
import { Route } from 'react-router-dom'
import SetRole from 'containers/user-manage/add-set-roles'
import ModifyPositionRole from 'containers/position-manage/modify-position'
import PositionModifyStaff from 'containers/position-manage/position-modify-staff'
import AddStaff from 'containers/position-manage//add-set-staff'
import AuthBtn from 'components/auth-button'
import GoBack from 'components/go-back'

const DetailItem = props => (
	<Col span={8}>
		<span>{props.label}：</span>
		<span style={{ color: 'rgba(0,0,0,0.5)' }}>{props.children}</span>
	</Col>
)

class PositionDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			roleListData: [], // 角色列表数据
			staffListData: [], // 员工列表数据
			positionDetailData: {}, // 职位详情
			roleTableLoading: false,
			staffTableLoading: false,
			positionTypes: [],
			positionLevels: [],
			authTypes: []
		}
	}
	componentWillMount() {
		const positionId = this.props.match.params.positionId
		request.send(HTTP_CMD.POSITION_DETAIL, { positionId }).then((res) => {
			this.setState({ positionDetailData: res.data })
		})
		this._getPositionRoles()
		this._getPositionStaffs()
		this._loadPositionTypes()
		this._loadAuthTypes()
		this._loadPositionLevels()
	}
	_getPositionRoles = () => { // 请求职位关联的角色
		const positionId = this.props.match.params.positionId
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.POSITION_ROLE, { positionId }).then((res) => {
			this.setState({ tableLoading: false, roleListData: res.data })
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}
	_getPositionStaffs = () => { // 请求职位关联的员工
		const positionId = this.props.match.params.positionId
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.POSITION_STAFF, { positionId }).then((res) => {
			this.setState({ tableLoading: false, staffListData: res.data })
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}
	_loadPositionTypes() {
		helper.queryAllFields('position_type').then((datas) => {
			this.setState({
				positionTypes: datas
			})
		})
	}
	_loadAuthTypes() {
		helper.queryAllFields('auth_type').then((datas) => {
			this.setState({
				authTypes: datas
			})
		})
	}
	_loadPositionLevels() {
		helper.queryAllFields('position_level').then((datas) => {
			this.setState({
				positionLevels: datas
			})
		})
	}
	handleAddRole = () => { // 添加角色
		this.props.history.push({
			pathname: `${this.props.match.url}/add-role`,
			positionDetailData: this.state.positionDetailData,
			roleListData: this.state.roleListData
		})
	}
	handleAddStaff = () => { // 添加员工
		this.props.history.push({
			pathname: `${this.props.match.url}/add-staff`,
			positionDetailData: this.state.positionDetailData,
			staffListData: this.state.staffListData
		})
	}
	handlePositionAddRole = (roleIdList, that) => { // 传给添加角色组件执行
		that.setState({ confirmLoading: true })
		request.send(HTTP_CMD.POSITION_ROLE_ADD, { positionId: this.state.positionDetailData.positionId, roleIdList }).then((res) => {
			that.setState({ confirmLoading: false })
			message.success(res.msg)
			this._getPositionRoles()
			that.props.history.goBack()
		}).catch(() => that.setState({ confirmLoading: false }))
	}
	handlePositionAddStaff = (staffIdList, that) => { // 传给添加员工组件执行
		that.setState({ confirmLoading: true })
		request.send(HTTP_CMD.POSITION_STAFF_ADD, { positionId: this.state.positionDetailData.positionId, employeeIdList: staffIdList }).then((res) => {
			that.setState({ confirmLoading: false })
			message.success(res.msg)
			this._getPositionStaffs()
			that.props.history.goBack()
		}).catch(() => that.setState({ confirmLoading: false }))
	}
	handleModifyPosition = () => { // 往编辑职位
		const positionId = this.props.match.params.positionId
		this.props.history.push(`/app/position-manage/position-modify/${positionId}`)
	}
	handleViewRole = (roleId) => {
		this.props.history.push(`/app/role-manage/role-detail/${roleId}`)
	}
	handleViewStaff = (employeeId) => {
		this.props.history.push(`/app/staff-manage/staff-detail/${employeeId}`)
	}
	handleModifyRole = (record) => { // 修改角色
		this.props.history.push({
			pathname: `${this.props.match.url}/modify-role`,
			positionDetail: this.state.positionDetailData,
			roleRecord: record
		})
	}
	handleDelRole = (roleId) => { // 删除角色
		helper.confirm('确定删除该角色吗?').then(() => {
			request.send(HTTP_CMD.POSITION_ROLE_DELETE, { roleId, positionId: this.state.positionDetailData.positionId })
				.then((res) => {
					message.success(res.msg)
					this._getPositionRoles()
				})
		})
	}
	handleModifyStaff = (record) => { // 修改员工
		this.props.history.push({
			pathname: `${this.props.match.url}/modify-staff`,
			positionDetail: this.state.positionDetailData,
			staffRecord: record
		})
	}
	handleDelStaff = (employeeId) => { // 删除员工
		helper.confirm('确定删除该员工吗').then(() => {
			request.send(HTTP_CMD.POSITION_STAFF_DELETE, { employeeId, positionId: this.state.positionDetailData.positionId })
				.then((res) => {
					message.success(res.msg)
					this._getPositionStaffs()
				})
		})
	}
	getDesc = (value, range) => {
		if (isNaN(value)) return null

		const item = range.find(_ => +_.columnValue === +value)

		return item ? item.valueDesc : null
	}
	render() {
		const {
			positionDetailData,
			positionLevels,
			positionTypes,
			authTypes
		} = this.state

		const positionLevelDesc = this.getDesc(positionDetailData.positionLevel, positionLevels)
		const positionTypeDesc = this.getDesc(positionDetailData.positionType, positionTypes)
		const authTypeDesc = this.getDesc(positionDetailData.authType, authTypes)

		const roleColumns = [
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
				dataIndex: 'endDt',
				width: '19%'
			},
			{
				title: '操作',
				dataIndex: 'roleId',
				width: '24%',
				render: (roleId, record) => (
					<div>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => { this.handleViewRole(roleId) }} actionId={ACTIONIDS_CMD.ROLE_DETAIL}>查看</AuthBtn>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => { this.handleModifyRole(record) }} actionId={ACTIONIDS_CMD.POSITION_ROLE_MODIFY}>修改</AuthBtn>
						<AuthBtn onClick={() => { this.handleDelRole(roleId) }} actionId={ACTIONIDS_CMD.POSITION_ROLE_DEL}>删除</AuthBtn>
					</div>
				)
			}
		]
		const staffColumns = [
			{
				title: '员工',
				dataIndex: 'employeeName',
				width: '19%'
			},
			{
				title: '员工编号',
				dataIndex: 'employeeCode',
				width: '19%'
			},
			{
				title: '当前状态',
				dataIndex: 'employeeState',
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
				dataIndex: 'endDt',
				width: '19%'
			},
			{
				title: '操作',
				dataIndex: 'employeeId',
				width: '24%',
				render: (employeeId, record) => (
					<div>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => this.handleViewStaff(employeeId)} actionId={ACTIONIDS_CMD.STAFF_DETAIL}>查看</AuthBtn>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => this.handleModifyStaff(record)} actionId={ACTIONIDS_CMD.POSITION_STAFF_MODIFY}>修改</AuthBtn>
						<AuthBtn onClick={() => this.handleDelStaff(employeeId)} actionId={ACTIONIDS_CMD.POSITION_STAFF_DEL}>删除</AuthBtn>
					</div>
				)
			}
		]
		return (
			<div>
				<div style={{ marginBottom: 20 }}>
					<GoBack {...this.props} />
				</div>
				<div className='g__block_flex_space-between'>
					<span style={{ fontSize: 16, color: '#000' }}>职位详情</span>
					<AuthBtn
						type='primary'
						onClick={this.handleModifyPosition}
						actionId={ACTIONIDS_CMD.POSITION_MODIFY}
					>
						编辑职位
					</AuthBtn>
				</div>
				<Row style={{ lineHeight: 2.5, marginTop: 10 }}>
					<DetailItem label='职位名称'>{positionDetailData.positionName}</DetailItem>
					<DetailItem label='部门编码'>{positionDetailData.deptId}</DetailItem>
					<DetailItem label='上级职位'>{positionDetailData.fPositionName}</DetailItem>
					<DetailItem label='职位描述'>{positionDetailData.positionDesc}</DetailItem>
					<DetailItem label='是否经理'>{positionDetailData.isManager === 2 ? '是' : '否'}</DetailItem>
					<DetailItem label='职位类别'>{positionTypeDesc}</DetailItem>
					<DetailItem label='职位级别'>{positionLevelDesc}</DetailItem>
					<DetailItem label='数据权限'>{authTypeDesc}</DetailItem>
					<DetailItem label='更新日期'>{positionDetailData.updateDt}</DetailItem>
					<DetailItem label='更新者'>{positionDetailData.updater}</DetailItem>
					<DetailItem label='创建日期'>{positionDetailData.createDt}</DetailItem>
					<DetailItem label='创建者'>{positionDetailData.creator}</DetailItem>
				</Row>
				<Divider />
				<div>
					<div className='g__block_flex_space-between'>
						<span style={{ fontSize: 16, color: '#000' }}>{positionDetailData.positionName}的角色</span>
						<AuthBtn type='primary' onClick={this.handleAddRole} actionId={ACTIONIDS_CMD.POSITION_ROLE_ADD}>
							添加角色
						</AuthBtn>
					</div>
					<Table
						style={{ marginTop: 15 }}
						rowKey='roleId'
						loading={this.state.roleTableLoading}
						columns={roleColumns}
						dataSource={this.state.roleListData}
						pagination={false}
						scroll={{ y: 400 }}
					/>
				</div>
				<Route path={`${this.props.match.url}/modify-role`} render={props => <ModifyPositionRole {...props} onOk={this._getPositionRoles} />} />
				<Route path={`${this.props.match.url}/modify-staff`} render={props => <PositionModifyStaff {...props} onOk={this._getPositionStaffs} />} />
				<Route path={`${this.props.match.url}/add-role`} render={props => <SetRole {...props} onOk={this.handlePositionAddRole} />} />
				<Route path={`${this.props.match.url}/add-staff`} render={props => <AddStaff {...props} onOk={this.handlePositionAddStaff} />} />
			</div>
		)
	}
}
export default PositionDetail
