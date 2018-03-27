import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Table, Tabs, Button, Select, Spin } from 'antd'
import AuthButton from 'components/auth-button'
import { AgentHOC } from 'components/connect'

import styles from './index.scss'
import Modal from './Modal'

const Search = Input.Search
const TabPane = Tabs.TabPane
const Option = Select.Option

class AgentList extends Component {
	constructor(props) {
		super(props)
		const allActionCodes = utils.getLocalData('allActionCodes', true)
		const tabPanels = [
			{
				tabName: '我的代理人',
				actionId: 'A_11206',
				key: '0'
			},
			{
				tabName: '我团队的代理人',
				actionId: 'A_11208',
				key: '1'
			},
			{
				tabName: '我组织的代理人',
				actionId: 'A_11210',
				key: '2'
			},
			{
				tabName: '跨组织的代理人',
				actionId: 'A_11212',
				key: '3'
			},
			{
				tabName: '所有代理人',
				actionId: 'A_11214',
				key: '4'
			}
		]
		this.visibleTabPanels = tabPanels.filter(panel => (
			allActionCodes.indexOf(panel.actionId) > 0
		))
	}
	state = {
		productGroups: [],
		scenicSpots: [],
		total: 0,
		current: 1,
		dataSource: [],
		pageSize: 10,
		selectedRowKeys: [],
		loading: false,
		keywords: '',
		keywordsDisplay: '',
		agentPrograms: [],
		showModal: false,
		fetch: false,
		agentList: [],
		agentKeywords: '',
		fAgentId: ''
	}

	componentWillMount() {
		const { search } = this.props
		this.extractParams(search, true)

		this._loadAgentPrograms()
		this._loadAgentList()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const search = nextProps.location.search
			this.extractParams(search)
		}
	}

	getAgentList = () => {
		const {
			current,
			keywords,
			pageSize,
			tabType,
			fAgentId
		} = this.state
		const params = {
			current,
			size: pageSize,
			condition: {
				keywords,
				fAgentId
			}
		}

		this.setState({
			loading: true,
			selectedRowKeys: []
		})

		const url = this.getRequestUrl(tabType)
		request.send(url, params).then((res) => {
			const {
				total,
				records
			} = res.data

			this.setState({
				total,
				current: res.data.current,
				dataSource: records.map((item) => {
					const { children, ...other } = item
					return other
				}),
				loading: false
			})
		}).catch(() => {
			this.setState({
				loading: false,
				dataSource: []
			})
		})
	}

	getRequestUrl = (tabType) => {
		switch (tabType) {
		case '0':
			return HTTP_CMD.AGENT_MINE
		case '1':
			return HTTP_CMD.AGENT_MINE_TEAM
		case '2':
			return HTTP_CMD.AGENT_MINE_ORG
		case '3':
			return HTTP_CMD.AGENT_CROSS_ORG
		case '4':
			return HTTP_CMD.AGENT_ALL
		default:
			return ''
		}
	}

	getAgentStatusDesc = (status) => {
		if (isNaN(status)) return ''
		const { agentStatus: { agentStatuses } } = this.props
		const item = agentStatuses.find(_ => _.columnValue === +status)

		return item ? item.valueDesc : status
	}

	getAgentCategory = (category) => {
		if (isNaN(category)) return ''
		const { agentCategory: { agentCategories } } = this.props
		const item = agentCategories.find(_ => _.columnValue === +category)

		return item ? item.valueDesc : category
	}

	getAgentProgram = (agentPrograms, programId) => {
		const program = agentPrograms.find(_ => _.agentProgramId === programId)

		return program ? program.agentProgramName : ''
	}


	pageChange = (page) => {
		this.setState({
			current: page
		}, () => {
			this.handleParamsChange()
		})
	}

	handleSearchAgent = (val) => {
		this.setState({
			keywords: val,
			current: 1
		}, () => {
			this.handleParamsChange()
		})
	}

	handleSearchChange = (e) => {
		this.setState({
			keywordsDisplay: e.target.value
		})
	}

	handleSelect = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys
		})
	}

	handleViewAgent = (agentId) => {
		const {
			history
		} = this.props

		history.push(`/app/agent-manage/agent-detail/${agentId}`)
	}

	handleEditAgent = (agentId) => {
		const {
			history
		} = this.props

		history.push(`/app/agent-manage/edit-agent/${agentId}`)
	}

	handleTabChange = (tabType) => {
		this.setState({
			tabType,
			current: 1,
			fAgentId: ''
		}, () => {
			this.handleParamsChange()
		})
	}

	handleParamsChange = () => {
		this.setState({
			selectedRowKeys: []
		})
		const {
			keywords,
			current,
			tabType,
			fAgentId = ''
		} = this.state

		const {
			history,
			match: { url }
		} = this.props

		const params = {
			keywords,
			page: current,
			tabType,
			fAgentId
		}

		const entries = Object.keys(params).map(key => `${key}=${params[key]}`)

		history.push(`${url}?${entries.join('&')}`)
	}

	handleSearchFAgent = (value) => {
		debug.log('executed')

		this.setState({
			agentKeywords: value
		}, () => {
			this._loadAgentList()
		})
	}

	handleFAgentIdChange = (val) => {
		this.setState({
			fAgentId: val
		}, () => {
			this.handleParamsChange()
		})
	}

	showBatchUpdateModal = () => {
		this.setState({
			showModal: true
		})
	}

	extractParams(search, changeDisplay) {
		const current = utils.getParameterByName('page', search) || 1
		const keywords = utils.getParameterByName('keywords', search) || ''
		const tabType = utils.getParameterByName('tabType', search) || this.visibleTabPanels[0].key
		const fAgentId = utils.getParameterByName('fAgentId', search) || ''

		if (changeDisplay) this.setState({ keywordsDisplay: keywords })

		this.setState({
			current,
			keywords,
			tabType,
			fAgentId
		}, () => {
			this.getAgentList()
		})
	}

	_loadAgentList = () => {
		this.setState({ fetching: true })
		const {
			agentKeywords
		} = this.state

		request.send(HTTP_CMD.AGENT_ALL, {
			current: 1,
			size: 10,
			condition: {
				keywords: agentKeywords
			}
		}).then((res) => {
			this.setState({
				agentList: res.data.records,
				fetching: false
			})
		}).catch(() => {
			this.setState({
				agentList: [],
				fetch: false
			})
		})
	}

	_loadAgentPrograms = () => {
		const params = {
			current: 1,
			size: 100,
			condition: {
				textQuery: ''
			}
		}

		request.send(HTTP_CMD.DISTRIBUTION_SYS_LIST, params).then((res) => {
			this.setState({
				agentPrograms: res.data.records
			})
		})
	}

	render() {
		const {
			keywordsDisplay,
			selectedRowKeys,
			total,
			current,
			dataSource,
			loading,
			agentPrograms,
			pageSize,
			showModal,
			fetching,
			agentList,
			fAgentId
		} = this.state

		const searchProps = {
			value: keywordsDisplay,
			style: { width: 250 },
			onSearch: this.handleSearchAgent,
			onChange: this.handleSearchChange,
			enterButton: '搜索'
		}

		const columns = [
			{
				title: '姓名',
				dataIndex: 'contactName'
			},
			{
				title: '手机号码',
				dataIndex: 'mobile'
			},
			{
				title: '上级',
				dataIndex: 'fContactName'
			},
			{
				title: '所属体系',
				dataIndex: 'agentProgramId',
				render: programId => this.getAgentProgram(agentPrograms, programId)
			},
			{
				title: '代理类型',
				dataIndex: 'agentCategory',
				render: category => this.getAgentCategory(category)
			},
			{
				title: '代理等级',
				dataIndex: 'agentTier'
			},
			{
				title: '状态',
				dataIndex: 'agentStatus',
				render: status => this.getAgentStatusDesc(status)
			},
			{
				title: '操作',
				dataIndex: 'agentId',
				width: 170,
				render: agentId => (
					<span>
						<AuthButton onClick={() => this.handleViewAgent(agentId)} style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.AGENT_DETAIL}>查看</AuthButton>
						<AuthButton onClick={() => this.handleEditAgent(agentId)} actionId={ACTIONIDS_CMD.AGENT_MODIFY}>编辑</AuthButton>
					</span>
				)
			}
		]

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleSelect
		}

		const pagination = {
			total,
			current,
			pageSize,
			onChange: this.pageChange
		}

		const tableProps = {
			dataSource,
			columns,
			pagination,
			rowSelection,
			loading,
			rowKey: 'agentId'
		}

		const modalProps = {
			agentIdList: selectedRowKeys,
			onSuccess: () => {
				this.setState({
					showModal: false
				})

				this.getAgentList()
			},
			onCancle: () => {
				this.setState({ showModal: false })
			}
		}

		const fAgentSelectProps = {
			value: fAgentId,
			style: { marginRight: 15, width: 250 },
			showSearch: true,
			allowClear: true,
			placeholder: '输入上级代理人名称过滤搜索',
			filterOption: false,
			onSearch: utils.debounce(this.handleSearchFAgent, 400),
			onChange: this.handleFAgentIdChange,
			notFoundContent: fetching ? <Spin size='small' /> : null,
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		return (
			<div className={styles['agent-list']}>
				<Tabs onChange={this.handleTabChange} type='card' activeKey={this.state.tabType}>
					{ this.visibleTabPanels.map(tab => <TabPane tab={tab.tabName} key={tab.key} />)}
				</Tabs>
				<div className='content-header'>
					<div>
						<Select {...fAgentSelectProps}>
							{ agentList.map(agent => <Option value={String(agent.agentId)}>{agent.contactName}({agent.mobile})</Option>)}
						</Select>
						<Search {...searchProps} />
					</div>
					<div>
						<Link to='/app/agent-manage/create-agent' style={{ marginRight: 10 }}>
							<AuthButton type='primary' actionId={ACTIONIDS_CMD.AGENT_CREATE}>新建</AuthButton>
						</Link>
						<Button type='primary' disabled={selectedRowKeys.length < 1} onClick={() => this.showBatchUpdateModal()}>批量修改</Button>
					</div>
				</div>
				<div className='content-body'>
					<Table {...tableProps} />
				</div>
				{ showModal && <Modal {...modalProps} /> }
			</div>
		)
	}
}

export default AgentHOC(AgentList)
