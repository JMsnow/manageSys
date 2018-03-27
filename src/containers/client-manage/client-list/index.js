import React from 'react'
import { Row, Col, Table, Tabs, Input, message } from 'antd'
import AuthBtn from 'components/auth-button'

const TabPane = Tabs.TabPane
const Search = Input.Search

class ClientList extends React.Component {
	constructor(props) {
		super(props)
		this.columns = [
			{
				title: '识别码编号',
				dataIndex: 'idCode',
				width: '20%'
			}, {
				title: '客户名称',
				dataIndex: 'customerName',
				width: '15%'
			}, {
				title: '邮箱',
				dataIndex: 'email',
				width: '20%'
			}, {
				title: '电话',
				dataIndex: 'mobile',
				width: '15%'
			}, {
				title: '状态',
				dataIndex: 'isActive',
				width: '10%',
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
				title: '操作',
				dataIndex: 'customerId',
				width: '20%',
				render: (customerId, record) => (
					<div style={{ width: 230 }}>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => this.handleViewClient(record)} actionId={ACTIONIDS_CMD.CLIENT_DETAIL}>查看</AuthBtn>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => this.handleModifyClient(record)} actionId={ACTIONIDS_CMD.CLIENT_MODIFY}>编辑</AuthBtn>
						<AuthBtn onClick={() => this.handleDeleteClient(customerId)} actionId={ACTIONIDS_CMD.CLIENT_DELETE}>删除</AuthBtn>
					</div>
				)
			}
		]
	}

	state = {
		tableLoading: false,
		clientListData: [],
		selectedRowKeys: [],
		currentPage: 1,
		currentTagType: '1',
		tabType: '',
		total: 1,
		keywords: ''
	}

	componentWillMount() {
		const clientPageData = utils.getSessionData('clientPageData', true) || {}
		const firstLoadTabType = this._getFirstLoadTabType()
		if (this.props.history.action === 'PUSH') {
			utils.removeSessionData('clientPageData')
		}
		if (firstLoadTabType === '') { // 若tab全部禁用则不发请求
			return
		}
		this._getClientList({
			tabType: clientPageData.tabType || firstLoadTabType,
			current: clientPageData.currentPage || 1,
			condition: { keywords: clientPageData.keyWords || '' }
		})
	}

	_storagePageData = () => {
		const { currentPage, keywords, tabType } = this.state
		utils.setSessionData('clientPageData', { currentPage, keywords, tabType })
	}

	_getClientList = ({ tabType = '1', current = 1, condition = { keywords: '' }, size = 10 }) => {
		const url = this._getUrlByTabType(tabType)
		const reqParams = { current, condition, size }
		this.setState({ tableLoading: true })
		request.send(url, reqParams).then((res) => {
			this.setState({
				tableLoading: false,
				clientListData: res.data.records,
				total: res.data.total,
				currentPage: res.data.current,
				keywords: res.data.condition.keywords,
				tabType
			})
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}

	_getUrlByTabType = (tabType) => {
		switch (tabType) {
		case '0':
			return HTTP_CMD.CLIENT_MINE
		case '1':
			return HTTP_CMD.CLIENT_MINE_TEAM
		case '2':
			return HTTP_CMD.CLIENT_MINE_ORG
		case '3':
			return HTTP_CMD.CLIENT_ORG
		case '4':
			return HTTP_CMD.CLIENT_ALL
		default:
			return ''
		}
	}

	_getFirstLoadTabType = () => {
		const tabTypes = ['A_7410', 'A_7411', 'A_7414', 'A_7415', 'A_7412']
		const allActionCodes = utils.getLocalData('allActionCodes', true)
		for (let i = 0, len = tabTypes.length; i < len; i += 1) {
			if (allActionCodes.indexOf(tabTypes[i]) > -1) {
				return `${i}`
			}
		}
		return ''
	}

	handleSearch = (value) => {
		this._getClientList({ tabType: this.state.tabType, condition: { keywords: value } })
	}

	handleCreate =() => {
		this.props.history.push('/app/client-manage/client-create')
	}

	handleStop =() => {
		const { selectedRowKeys, tabType, currentPage, keywords } = this.state
		helper.confirm('确定停用所选客户吗？').then(() => {
			request.send(HTTP_CMD.CLIENT_DISABLE, { customerIdList: selectedRowKeys }).then(() => {
				this.setState({ selectedRowKeys: [] })
				this._getClientList({ tabType, current: currentPage, condition: { keywords } })
			})
		})
	}

	handleActive =() => {
		const { selectedRowKeys, tabType, currentPage, keywords } = this.state
		helper.confirm('确定激活所选客户吗？').then(() => {
			request.send(HTTP_CMD.CLIENT_ENABLE, { customerIdList: selectedRowKeys }).then(() => {
				this.setState({ selectedRowKeys: [] })
				this._getClientList({ tabType, current: currentPage, condition: { keywords } })
			})
		})
	}

	handleViewClient = (record) => {
		this._storagePageData()
		this.props.history.push(`/app/client-manage/client-detail/${record.customerId}`, { record, listState: this.state })
	}

	handleModifyClient = (record) => {
		this._storagePageData()
		this.props.history.push(`/app/client-manage/client-modify/${record.customerId}`, { record })
	}

	handleDeleteClient = (customerId) => {
		const { tabType, currentPage, keywords } = this.state
		helper.confirm('确定删除该客户吗？').then(() => {
			request.send(HTTP_CMD.CLIENT_DELETE, { customerId }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedRowKeys: [] })
				this._getClientList({ tabType, current: currentPage, condition: { keywords } })
			})
		})
	}

	handleTabChange = (tabType) => {
		this._getClientList({ tabType })
	}

	pageChange = (page) => {
		const { tabType, keywords } = this.state
		this._getClientList({ tabType, current: page, condition: { keywords } })
	}

	render() {
		const rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys,
			onChange: (selectedRowKeys) => {
				this.setState({ selectedRowKeys })
			}
		}
		const allActionCodes = utils.getLocalData('allActionCodes', true)
		return (
			<Row>
				<Col span={24}>
					<Row>
						<Tabs onChange={this.handleTabChange} type='card' activeKey={this.state.tabType}>
							<TabPane tab='我的客户' key='0' disabled={allActionCodes.indexOf('A_7410') < 0} />
							<TabPane tab='我团队的客户' key='1' disabled={allActionCodes.indexOf('A_7411') < 0} />
							<TabPane tab='我组织的客户' key='2' disabled={allActionCodes.indexOf('A_7414') < 0} />
							<TabPane tab='跨组织的客户' key='3' disabled={allActionCodes.indexOf('A_7415') < 0} />
							<TabPane tab='所有客户' key='4' disabled={allActionCodes.indexOf('A_7412') < 0} />
						</Tabs>
					</Row>
					<Row type='flex' justify='space-between' style={{ marginTop: 30 }}>
						<Col>
							<Search
								style={{ width: 200 }}
								onSearch={this.handleSearch}
								value={this.state.keywords}
								onChange={e => this.setState({ keywords: e.target.value })}
							/>
						</Col>
						<Col>
							<AuthBtn style={{ marginLeft: 10 }} type='primary' onClick={this.handleCreate} actionId={ACTIONIDS_CMD.CLIENT_CREATE}>新建</AuthBtn>
							<AuthBtn
								style={{ marginLeft: 10 }}
								type='primary'
								disabled={this.state.selectedRowKeys.length < 1}
								onClick={this.handleStop}
								actionId={ACTIONIDS_CMD.CLIENT_DISABLE}
							>
								停用
							</AuthBtn>
							<AuthBtn
								style={{ marginLeft: 10 }}
								type='primary'
								disabled={this.state.selectedRowKeys.length < 1}
								onClick={this.handleActive}
								actionId={ACTIONIDS_CMD.CLIENT_ENABLE}
							>
								激活
							</AuthBtn>
						</Col>
					</Row>
					<Row style={{ marginTop: 10 }}>
						<Table
							rowKey='customerId'
							loading={this.state.tableLoading}
							rowSelection={rowSelection}
							columns={this.columns}
							dataSource={this.state.clientListData}
							pagination={{ total: this.state.total, onChange: this.pageChange, current: this.state.currentPage }}
						/>
					</Row>
				</Col>
			</Row>
		)
	}
}

export default ClientList
