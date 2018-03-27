import React from 'react'
import { Link } from 'react-router-dom'
import { Input, Table, message } from 'antd'
import AuthBtn from 'components/auth-button'

class DistributionList extends React.Component {
	state = {
		distributionListData: [],
		total: 1,
		tableLoading: false,
		textQuery: '',
		curPage: 1
	}

	componentWillMount() {
		this._getDistributionList({
			current: utils.getParameterByName('page') || 1,
			condition: { textQuery: utils.getParameterByName('search') || '' }
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this._getDistributionList({
				current: utils.getParameterByName('page') || 1,
				condition: { textQuery: utils.getParameterByName('search') || '' }
			})
		}
	}

	_getDistributionList= ({ current = 1, size = 10, condition = { textQuery: '' } }) => { // 请求列表数据
		this.setState({ tableLoading: true })
		request.send(HTTP_CMD.DISTRIBUTION_SYS_LIST, { current, size, condition }).then((res) => {
			this.setState({
				distributionListData: res.data.records,
				curPage: res.data.current,
				textQuery: condition.textQuery,
				total: res.data.total,
				tableLoading: false
			})
		}).catch(() => {
			this.setState({ tableLoading: false })
		})
	}

	handleSearch = (value) => {
		this.props.history.push(`${this.props.match.url}?page=1&search=${value}`)
	}

	handleView = (id) => {
		this.props.history.push(`${this.props.match.path}/distribution-detail/${id}`, {})
	}

	handleModify = (id) => {
		this.props.history.push(`${this.props.match.path}/distribution-modify/${id}`, { pageState: 3 })
	}

	handleDelete = (id) => {
		helper.confirm('确定删除该分销体系吗？').then(() => {
			request.send(HTTP_CMD.DISTRIBUTION_SYS_DEL, { agentProgramId: id }).then((res) => {
				message.success(res.msg)
				this._getDistributionList({
					current: this.state.curPage,
					condition: { textQuery: this.state.textQuery }
				})
			})
		})
	}

	pageChange = (page) => {
		this.props.history.push(`${this.props.match.url}?page=${page}&search=${this.state.textQuery}`)
	}

	render() {
		const columns = [{
			title: '分销体系',
			dataIndex: 'agentProgramName'
		}, {
			title: '所属组织',
			dataIndex: 'boOrgDtoList',
			render: boOrgDtoList => <span>{boOrgDtoList.map(item => item.deptName).join(',')}</span>
		}, {
			title: '创建时间',
			dataIndex: 'createDt'
		}, {
			title: '创建者',
			dataIndex: 'creator'
		}, {
			title: '操作',
			dataIndex: 'agentProgramId',
			width: 250,
			render: id => (<div>
				<AuthBtn
					style={{ marginRight: 5 }}
					onClick={() => this.handleView(id)}
					actionId={ACTIONIDS_CMD.AGENT_SYS_DETAIL}
				>
					查看
				</AuthBtn>
				<AuthBtn
					style={{ marginRight: 5 }}
					onClick={() => this.handleModify(id)}
					actionId={ACTIONIDS_CMD.AGENT_SYS_MODIFY}
				>
					编辑
				</AuthBtn>
				<AuthBtn
					onClick={() => this.handleDelete(id)}
					actionId={ACTIONIDS_CMD.AGENT_SYS_DELETE}
				>
					删除
				</AuthBtn>
			</div>)
		}]
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Input.Search
						placeholder='请输入关键字搜索'
						style={{ width: 200 }}
						value={this.state.textQuery}
						onChange={e => this.setState({ textQuery: e.target.value })}
						onSearch={this.handleSearch}
					/>
					<Link to={{
						pathname: '/app/distribution-system-manage/distribution-create',
						state: { pageState: 1 }
					}}
					>
						<AuthBtn type='primary' style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.AGENT_SYS_CREATE}>新建</AuthBtn>
					</Link>
				</div>
				<div style={{ marginTop: 20 }}>
					<div>
						<Table
							rowKey='agentProgramId'
							loading={this.state.tableLoading}
							columns={columns}
							dataSource={this.state.distributionListData}
							pagination={{ total: this.state.total, onChange: this.pageChange, current: this.state.curPage }}
						/>
					</div>
				</div>
			</div>
		)
	}
}
export default DistributionList
