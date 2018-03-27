import React, { Component } from 'react'
import { Table, Row, Col, Divider, message } from 'antd'
import { Route } from 'react-router-dom'
import AuthBtn from 'components/auth-button'
import SetFuntion from '../set-function'

const DetailItem = props => (
	<Col span={8}>
		<span>{props.label}：</span>
		<span style={{ color: 'rgba(0,0,0,0.5)' }}>{props.children}</span>
	</Col>
)

class RoleDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			funListData: [],
			hasFuns: {},
			roleDetailData: {},
			tableLoading: false
		}
	}
	componentWillMount() {
		const roleId = this.props.match.params.roleId
		request.send(HTTP_CMD.ROLE_DETAIL, { roleId }).then((res) => {
			this.setState({ roleDetailData: res.data })
		})
		this._getUserFuntions()
	}
	_getUserFuntions = () => {
		const roleId = this.props.match.params.roleId
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.ROLE_FUN, { roleId }).then((res) => {
			this.setState({ tableLoading: false })
			this.setState({ funListData: res.data, hasFuns: this._disposeFuns(res.data) })
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}
	_disposeFuns = (data) => {
		const hasFuns = {
			actions: [],
			menus: []
		}
		data.forEach((item) => {
			if (item.actionType === '0') {
				hasFuns.menus.push(item)
			}
			if (item.actionType === '1') {
				hasFuns.actions.push(item)
			}
		})
		return hasFuns
	}
	handleAddFun = () => { // 添加功能
		this.props.history.push({
			pathname: `${this.props.match.url}/add-fun`,
			roleDetailData: this.state.roleDetailData,
			funListData: this.state.funListData,
			hasFuns: this.state.hasFuns
		})
	}
	handleUpdateFunction = (that, selectActions) => {
		that.setState({ confirmLoading: true })
		request.send(HTTP_CMD.ROLE_MENU_ADD, { roleId: this.state.roleDetailData.roleId, menuNodeIdList: that.state.menuNodeIdList })
			.then(res => res)
			.then(() => {
				request.send(HTTP_CMD.ROLE_FUN_ADD, { roleId: this.state.roleDetailData.roleId, selectActions })
					.then((res) => {
						that.setState({ confirmLoading: false })
						message.success(res.msg)
						this._getUserFuntions()
						that.props.history.goBack()
					}).catch(() => {
						that.setState({ confirmLoading: false })
					})
			})
	}
	handleModify = () => { // 往编辑角色
		const roleId = this.props.match.params.roleId
		this.props.history.push(`/app/role-manage/role-modify/${roleId}`)
	}
	handleDelFun = record => () => {
		let url = ''
		let reqParams = ''
		if (record.actionType === '1') {
			url = HTTP_CMD.ROLE_FUN_DELETE
			reqParams = { actionId: record.actionId, rFRelaId: record.rFRelaId }
		}
		if (record.actionType === '0') {
			url = HTTP_CMD.ROLE_MENU_DELETE
			reqParams = { rFRelaId: record.rFRelaId }
		}
		helper.confirm('确定删除该功能吗').then(() => {
			request.send(url, reqParams)
				.then((res) => {
					message.success(res.msg)
					this._getUserFuntions()
				})
		})
	}
	render() {
		const { roleDetailData } = this.state
		const columns = [
			{
				title: '功能名称',
				dataIndex: 'menuNodeName',
				width: '14%',
				render: (text, record) => {
					if (record.actionType === '1') {
						return <span>{record.actionName}</span>
					}
					if (record.actionType === '0') {
						return <span>{record.menuNodeName}</span>
					}
					return <span>{'没返回actionType'}</span>
				}
			},
			{
				title: '功能描述',
				dataIndex: 'functionDesc',
				width: '15%'
			},
			{
				title: '功能代码',
				dataIndex: 'menuNodeCode',
				width: '14%'
			},
			{
				title: '上级菜单',
				dataIndex: 'fMenuNodeName',
				width: '14%'
			},
			{
				title: '功能类型',
				dataIndex: 'actionType',
				width: '14%',
				render: (text) => {
					switch (+text) {
					case 1 :
						return '功能'
					case 0 :
						return '菜单'
					default :
						return ''
					}
				}
			},
			{
				title: '有效标识',
				dataIndex: 'isActive',
				width: '14%',
				render: (text) => {
					switch (+text) {
					case 1 :
						return '有效'
					case 0 :
						return '无效'
					default :
						return ''
					}
				}
			},
			{
				title: '操作',
				dataIndex: 'action',
				width: '15%',
				render: (...params) => (
					<AuthBtn onClick={this.handleDelFun(params[1])} actionId={ACTIONIDS_CMD.ROLE_FUN_DEL}>删除</AuthBtn>
				)
			}
		]
		return (
			<div>
				<div className='g__block_flex_space-between'>
					<span style={{ fontSize: 16, color: '#000' }}>角色详情</span>
					<AuthBtn
						type='primary'
						onClick={this.handleModify}
						actionId={ACTIONIDS_CMD.ROLE_MODIFY}
					>
						编辑角色
					</AuthBtn>
				</div>
				<Row style={{ lineHeight: 2.5, marginTop: 10 }}>
					<DetailItem label='角色名称'>{roleDetailData.roleName}</DetailItem>
					<DetailItem label='角色描述'>{roleDetailData.roleDesc}</DetailItem>
					<DetailItem label='创建时间'>{roleDetailData.createDt}</DetailItem>
					<DetailItem label='更新时间'>{roleDetailData.updateDt}</DetailItem>
				</Row>
				<Divider />
				<div>
					<div className='g__block_flex_space-between'>
						<span style={{ fontSize: 16, color: '#000' }}>{roleDetailData.roleName}的功能</span>
						<AuthBtn type='primary' onClick={this.handleAddFun} actionId={ACTIONIDS_CMD.ROLE_FUN_ADD}>
							添加功能
						</AuthBtn>
					</div>
					<Table
						style={{ marginTop: 15 }}
						pagination={false}
						loading={this.state.tableLoading}
						columns={columns}
						dataSource={this.state.funListData}
						scroll={{ y: 400 }}
					/>
				</div>
				<Route path={`${this.props.match.url}/add-fun`} render={props => <SetFuntion {...props} onOk={this.handleUpdateFunction} />} />
			</div>
		)
	}
}
export default RoleDetail
