import React from 'react'
import { Input, Table, message } from 'antd'
import AuthBtn from 'components/auth-button'

class RulesList extends React.Component {
	state = {
		rulesListData: [],
		total: 1,
		tableLoading: false,
		commRuleStatus: [],
		textQuery: '',
		curPage: 1,
		selectedRowKeys: []
	}

	componentWillMount() {
		this._getRulesList({
			current: utils.getParameterByName('page') || 1,
			condition: {
				textQuery: utils.getParameterByName('search') || ''
			}
		})
		helper.queryAllFields('comm_rule_status')
			.then((data) => {
				this.setState({ commRuleStatus: data })
			})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this._getRulesList({
				current: utils.getParameterByName('page') || 1,
				condition: {
					textQuery: utils.getParameterByName('search') || ''
				}
			})
		}
	}

	_getRulesList= ({ current = 1, size = 10, condition = { textQuery: '' } }) => { // 请求列表数据
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.RULES_LIST, { current, size, condition }).then((res) => {
			this.setState({
				rulesListData: res.data.records,
				curPage: res.data.current,
				textQuery: condition.textQuery,
				total: res.data.total,
				tableLoading: false
			})
		}).catch(() => {
			this.setState({
				tableLoading: false
			})
		})
	}

	handleUpdateRuleStatus = (status) => {
		const { selectedRowKeys, textQuery, curPage } = this.state
		request.send(HTTP_CMD.RULES_UPDATE_STATUS, { commRuleIdList: selectedRowKeys, commRuleStatus: status })
			.then((res) => {
				message.success(res.msg)
				this.setState({ selectedRowKeys: [] })
				this._getRulesList({ current: curPage, condition: { textQuery } })
			})
	}

	handleModify = (id) => {
		this.props.history.push(`${this.props.match.url}/rules-modify/${id}`)
	}

	pageChange = (page) => {
		this.props.history.push(`${this.props.match.url}?page=${page}&search=${this.state.textQuery}`)
	}

	render() {
		const columns = [
			{
				title: '规则名称',
				dataIndex: 'commRuleName',
				width: '15%'
			},
			{
				title: '商品名称',
				dataIndex: 'productName',
				width: '15%'
			},
			{
				title: '代理体系',
				dataIndex: 'agentProgramName',
				width: '15%'
			},
			{
				title: '规则描述',
				dataIndex: 'commRuleDesc',
				width: '15%'
			},
			{
				title: '状态',
				dataIndex: 'commRuleStatus',
				width: '10%',
				render: (commRuleStatus) => {
					const status = this.state.commRuleStatus.filter(item => item.columnValue === commRuleStatus)[0]
					return <span>{status ? status.valueDesc : null}</span>
				}
			},
			{
				title: '更新时间',
				dataIndex: 'updateDt',
				width: '10%'
			},
			{
				title: '操作',
				dataIndex: 'commRuleId',
				width: '15%',
				render: (id, record) => (<div style={{ width: 150 }}>
					<AuthBtn
						style={{ marginRight: 5 }}
						onClick={() => this.props.history.push(`${this.props.match.url}/rules-detail/${id}`)}
						actionId={ACTIONIDS_CMD.RULE_DETAIL}
					>
						查看
					</AuthBtn>
					{
						record.commRuleStatus === 0 || record.commRuleStatus === 2 ?
							null :
							<AuthBtn
								style={{ marginRight: 5 }}
								onClick={() => this.handleModify(id)}
								actionId={ACTIONIDS_CMD.RULE_MODIFY}
							>
								编辑
							</AuthBtn>
					}
				</div>)
			}
		]
		const rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys,
			onChange: (selectedRowKeys) => {
				this.setState({ selectedRowKeys })
			}
		}
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Input.Search
						placeholder='请输入关键字搜索'
						style={{ width: 200 }}
						value={this.state.textQuery}
						onChange={e => this.setState({ textQuery: e.target.value })}
						onSearch={value => (this.props.history.push(`${this.props.match.url}?page=1&search=${value}`))}
					/>
					<div>
						<AuthBtn
							style={{ marginRight: 10 }}
							type='primary'
							actionId={ACTIONIDS_CMD.RULE_CREATE}
							onClick={() => this.props.history.push('/app/rules-manage/rules-create')}
						>
							新建
						</AuthBtn>
						<AuthBtn
							style={{ marginRight: 10 }}
							type='primary'
							disabled={this.state.selectedRowKeys.length < 1}
							actionId={ACTIONIDS_CMD.RULE_PUBLIC}
							onClick={() => this.handleUpdateRuleStatus(2)}
						>
							发布
						</AuthBtn>
						<AuthBtn
							type='primary'
							disabled={this.state.selectedRowKeys.length < 1}
							actionId={ACTIONIDS_CMD.RULE_STOP}
							onClick={() => this.handleUpdateRuleStatus(1)}
						>
							停用
						</AuthBtn>
					</div>
				</div>
				<div style={{ marginTop: 20 }}>
					<div>
						<Table
							rowKey='commRuleId'
							loading={this.state.tableLoading}
							columns={columns}
							rowSelection={rowSelection}
							dataSource={this.state.rulesListData}
							pagination={{ total: this.state.total, onChange: this.pageChange, current: this.state.curPage }}
						/>
					</div>
				</div>
			</div>
		)
	}
}
export default RulesList
