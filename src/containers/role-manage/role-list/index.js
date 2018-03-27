import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Table, message } from 'antd'
import AuthBtn from 'components/auth-button'

class RoleList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			roleListData: [],
			selectedRowKeys: [],
			total: 1,
			tableLoading: false,
			textQuery: '',
			curPage: 1 // 当前页
		}
	}

	componentWillMount() {
		if (this.props.history.action === 'PUSH') {
			utils.removeSessionData('rolePageData')
		}
		const rolePageData = utils.getSessionData('rolePageData', true) || {}
		this._getRoleList({
			current: rolePageData.curPage || 1,
			condition: { textQuery: rolePageData.keyWords || '' }
		})
	}

	_storagePageData = () => {
		const rolePageData = {
			curPage: this.state.curPage,
			keyWords: this.state.textQuery
		}
		utils.setSessionData('rolePageData', rolePageData)
	}

	_getRoleList = ({ current = 1, size = 10, condition = { textQuery: '' } }) => { // 请求列表数据
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.ROLE_LIST, { current, size, condition }).then((res) => {
			this.setState({
				roleListData: res.data.records,
				curPage: res.data.current,
				textQuery: condition.textQuery,
				total: res.data.total,
				tableLoading: false
			})
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}

	pageChange = (page) => {
		this._getRoleList({ current: page, condition: { textQuery: this.state.textQuery } })
	}

	handleSearch = (e) => {
		const value = e.target.value
		this.setState({
			textQuery: value
		}, () => {
			utils.removeSessionData('rolePageData')
			this._getRoleList({ current: 1, condition: { textQuery: value } })
		})
	}

	handleStop = () => {
		helper.confirm('确定停用所选角色吗？').then(() => {
			request.send(HTTP_CMD.ROLE_DISABLE, { roleIdList: this.state.selectedRowKeys }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedRowKeys: [] })
				this._getRoleList({ current: this.state.curPage })
			})
		})
	}

	handleActivate = () => {
		helper.confirm('确定激活所选角色吗？').then(() => {
			request.send(HTTP_CMD.ROLE_ENABLE, { roleIdList: this.state.selectedRowKeys }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedRowKeys: [] })
				this._getRoleList({ current: this.state.curPage })
			})
		})
	}

	handleCheckRoleDetail = roleId => () => {
		this._storagePageData()
		this.props.history.push(`${this.props.match.path}/role-detail/${roleId}`)
	}

	handleModifyRole = roleId => () => {
		this._storagePageData()
		this.props.history.push(`${this.props.match.path}/role-modify/${roleId}`)
	}

	handleDeleteRole = roleId => () => {
		helper.confirm('确定删除所选角色吗？').then(() => {
			request.send(HTTP_CMD.ROLE_DELETE, { roleId }).then((res) => {
				this._getRoleList({ current: this.state.curPage, condition: { textQuery: this.state.textQuery } })
				message.success((res.msg))
			})
		})
	}

	render() {
		const self = this
		const rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys,
			onChange: (selectedRowKeys) => {
				self.setState({ selectedRowKeys })
			}
		}
		const columns = [{
			title: '角色名称',
			dataIndex: 'roleName',
			width: '15%'
		}, {
			title: '角色描述',
			dataIndex: 'roleDesc',
			width: '15%'
		}, {
			title: '状态',
			dataIndex: 'roleStatus',
			width: '10%',
			render: (text) => {
				switch (text) {
				case 1 :
					return <span className='helper__color_green'>启用</span>
				case 0 :
					return <span className='helper__color_red'>停用</span>
				default :
					return ''
				}
			}
		}, {
			title: '创建时间',
			dataIndex: 'createDt',
			width: '20%'
		}, {
			title: '更新时间',
			dataIndex: 'updateDt',
			width: '20%'
		}, {
			title: '操作',
			dataIndex: 'action',
			width: '15%',
			render: (...params) => (
				<div style={{ width: 220 }}>
					<AuthBtn style={{ marginRight: 5 }} onClick={this.handleCheckRoleDetail(params[1].roleId)} actionId={ACTIONIDS_CMD.ROLE_DETAIL}>查看</AuthBtn>
					<AuthBtn style={{ marginRight: 5 }} onClick={this.handleModifyRole(params[1].roleId)} actionId={ACTIONIDS_CMD.ROLE_MODIFY}>编辑</AuthBtn>
					<AuthBtn onClick={this.handleDeleteRole(params[1].roleId)} actionId={ACTIONIDS_CMD.ROLE_DELETE}>删除</AuthBtn>
				</div>
			)
		}]
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>
						<Input
							placeholder='请输入关键字搜索'
							style={{ width: 200 }}
							value={this.state.textQuery}
							onChange={this.handleSearch}
						/>
					</span>
					<span>
						<Link to='/app/role-manage/role-create'>
							<AuthBtn type='primary' style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.ROLE_CREATE}>新建角色</AuthBtn>
						</Link>
						<AuthBtn type='primary' style={{ marginRight: 10 }} onClick={this.handleStop} actionId={ACTIONIDS_CMD.ROLE_STOP} disabled={this.state.selectedRowKeys.length < 1} >停用</AuthBtn>
						<AuthBtn type='primary' onClick={this.handleActivate} actionId={ACTIONIDS_CMD.ROLE_ACTIVE} disabled={this.state.selectedRowKeys.length < 1}>激活</AuthBtn>
					</span>
				</div>
				<div style={{ marginTop: 20 }}>
					<div>
						<Table
							rowKey='roleId'
							loading={this.state.tableLoading}
							rowSelection={rowSelection}
							columns={columns}
							dataSource={this.state.roleListData}
							pagination={{ total: this.state.total, onChange: this.pageChange, current: this.state.curPage }}
						/>
					</div>
				</div>
			</div>
		)
	}
}
export default RoleList
