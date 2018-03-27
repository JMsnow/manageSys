import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Table, message } from 'antd'
import AuthBtn from 'components/auth-button'

class UserList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userListData: [],
			selectedRowKeys: [],
			total: 1,
			tableLoading: false,
			textQuery: '',
			curPage: 1 // 保存当前页数
		}
	}

	componentWillMount() {
		if (this.props.history.action === 'PUSH') {
			utils.removeSessionData('userPageData')
		}
		const userPageData = utils.getSessionData('userPageData', true) || {}
		this._getUserList({
			current: userPageData.curPage || 1,
			condition: { textQuery: userPageData.keyWords || '' }
		})
	}

	_storagePageData = () => {
		const userPageData = {
			curPage: this.state.curPage,
			keyWords: this.state.textQuery
		}
		utils.setSessionData('userPageData', userPageData)
	}

	_getUserList= ({ current = 1, size = 10, condition = { textQuery: '' } }) => { // 请求列表数据
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.USER_LIST, { current, size, condition }).then((res) => {
			this.setState({
				userListData: res.data.records,
				curPage: res.data.current,
				textQuery: res.data.condition.textQuery,
				total: res.data.total,
				tableLoading: false
			})
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}

	handleSearch = (e) => {
		const value = e.target.value
		this.setState({
			current: 1,
			textQuery: value
		}, () => {
			this._getUserList({ current: 1, condition: { textQuery: value } })
		})
	}
	handleStop = () => {
		helper.confirm('确定停用所选用户吗？').then(() => {
			request.send(HTTP_CMD.USER_DISABLE, { userIdList: this.state.selectedRowKeys }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedRowKeys: [] })
				this._getUserList({ current: this.state.curPage, condition: { textQuery: this.state.textQuery } })
			})
		})
	}

	handleActivate = () => {
		helper.confirm('确定激活所选用户吗？').then(() => {
			request.send(HTTP_CMD.USER_ENABLE, { userIdList: this.state.selectedRowKeys }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedRowKeys: [] })
				this._getUserList({ current: this.state.curPage, condition: { textQuery: this.state.textQuery } })
			})
		})
	}

	handleCheckUserDetail = userId => () => {
		this._storagePageData()
		this.props.history.push({
			pathname: `${this.props.match.path}/user-detail/${userId}`
		})
	}

	handleModify = userId => () => {
		this._storagePageData()
		this.props.history.push(`${this.props.match.path}/user-modify/${userId}`)
	}

	handleDelete = ({ userId }) => () => {
		helper.confirm('确定删除该用户吗？').then(() => {
			request.send(HTTP_CMD.USER_DEL, { userId }).then((res) => {
				message.success(res.msg)
				this._getUserList({ current: this.state.curPage, condition: { textQuery: this.state.textQuery } })
			})
		})
	}

	pageChange = (page) => {
		this._getUserList({ current: page, condition: { textQuery: this.state.textQuery } })
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
			title: '用户账号',
			dataIndex: 'loginName',
			key: 'loginName'
		}, {
			title: '用户状态',
			dataIndex: 'userStatus',
			key: 'userStatus',
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
		}, {
			title: '账号类型',
			dataIndex: 'loginType',
			key: 'loginType',
			render: text => (<span>{CONFIG.accountTypes[+text]}</span>)
		}, {
			title: '最近登录时间',
			dataIndex: 'lastUseDt',
			key: 'lastUseDt'
		}, {
			title: '用户昵称',
			dataIndex: 'nickName',
			key: 'nickName'
		}, {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: 250,
			render: (...params) => (<div>
				<AuthBtn style={{ marginRight: 5 }} onClick={this.handleCheckUserDetail(params[1].userId)} actionId={ACTIONIDS_CMD.USER_DETAIL}>查看</AuthBtn>
				<AuthBtn style={{ marginRight: 5 }} onClick={this.handleModify(params[1].userId)} actionId={ACTIONIDS_CMD.USER_MODIFY}>编辑</AuthBtn>
				<AuthBtn onClick={this.handleDelete({ userId: params[1].userId, index: params[2] })} actionId={ACTIONIDS_CMD.USER_DELETE}>删除</AuthBtn>
			</div>)
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
						<Link to={`${this.props.match.path}/user-create`}>
							<AuthBtn type='primary' style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.USER_CREATE}>新建用户</AuthBtn>
						</Link>
						<AuthBtn
							disabled={this.state.selectedRowKeys.length < 1}
							type='primary'
							style={{ marginRight: 10 }}
							onClick={this.handleStop}
							actionId={ACTIONIDS_CMD.USER_STOP}
						>
							停用
						</AuthBtn>
						<AuthBtn
							disabled={this.state.selectedRowKeys.length < 1}
							type='primary'
							style={{ marginRight: 10 }}
							onClick={this.handleActivate}
							actionId={ACTIONIDS_CMD.USER_ACTIVE}
						>
							激活
						</AuthBtn>
					</span>
				</div>
				<div style={{ marginTop: 20 }}>
					<div>
						<Table
							rowKey='userId'
							loading={this.state.tableLoading}
							rowSelection={rowSelection}
							columns={columns}
							dataSource={this.state.userListData}
							pagination={{ total: this.state.total, onChange: this.pageChange, current: this.state.curPage }}
						/>
					</div>
				</div>
			</div>
		)
	}
}
export default UserList
