import React, { Component } from 'react'
import { Input, Table } from 'antd'
import moment from 'moment'
import AuthButton from 'components/auth-button'
import { AgentHOC } from 'components/connect'

import Modal from './Modal'
import styles from './index.scss'

const Search = Input.Search

class UnauditedAgents extends Component {
	state = {
		total: 0,
		current: 1,
		pageSize: 10,
		dataSource: [],
		selectedRowKeys: [],
		loading: false,
		showModal: false,
		keywords: '',
		keywordsDisplay: '',
		agentPrograms: [],
		modalAgentId: null
	}

	componentDidMount() {
		const { search } = this.props.location

		this.extractParams(search)
		this._loadAgentPrograms()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const search = nextProps.location.search

			this.extractParams(search)
		}
	}

	getUnaunditedAgentList() {
		const {
			current,
			keywords,
			pageSize
		} = this.state

		const params = {
			current,
			size: pageSize,
			condition: {
				keywords
			}
		}

		this.setState({ loading: true })

		request.send(HTTP_CMD.UNAUDITED_AGENT_LIST, params).then((res) => {
			const { records, total } = res.data

			this.setState({
				total,
				dataSource: records.map((item) => {
					const { children, ...other } = item
					return other
				}),
				loading: false
			})
		}).catch(() => {
			this.setState({
				loading: false
			})
		})
	}

	getAgentStatusDesc = (status) => {
		if (isNaN(status)) return ''
		const { agentStatus: { agentStatuses } } = this.props
		const item = agentStatuses.find(_ => _.columnValue === +status)

		return item ? item.valueDesc : status
	}

	getAgentProgram = (agentPrograms, programId) => {
		const program = agentPrograms.find(_ => _.agentProgramId === programId)

		return program ? program.agentProgramName : ''
	}

	handleChange = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys
		})
	}

	handleSearchChange = (e) => {
		this.setState({
			keywordsDisplay: e.target.value
		})
	}

	handleSearch = (val) => {
		const { history, match: { url } } = this.props
		history.push(`${url}?keywords=${val}`)
	}

	handleViewUnauditAgent = (agentId) => {
		this.setState({
			showModal: true,
			modalAgentId: agentId
		})
	}

	pageChange = (page) => {
		const { keywords } = this.state
		const { history, match: { url } } = this.props

		if (keywords.length) {
			history.push(`${url}?keywords=${keywords}&page=${page}`)
		} else {
			history.push(`${url}?page=${page}`)
		}
	}

	extractParams(search) {
		const current = utils.getParameterByName('page', search) || 1
		const keywords = utils.getParameterByName('keywords', search) || ''

		this.setState({
			current,
			keywords,
			keywordsDisplay: keywords
		}, () => {
			this.getUnaunditedAgentList()
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
			total,
			current,
			dataSource,
			selectedRowKeys,
			loading,
			showModal,
			keywordsDisplay,
			agentPrograms,
			modalAgentId
		} = this.state

		const {
			agentCategory: { agentCategories },
			agentStatus: { agentStatuses }
		} = this.props

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
				title: '身份证号',
				dataIndex: 'idCode'
			},
			{
				title: '申请体系',
				dataIndex: 'agentProgramId',
				render: programId => this.getAgentProgram(agentPrograms, programId)
			},
			{
				title: '上级代理',
				dataIndex: 'fContactName'
			},
			{
				title: '状态',
				dataIndex: 'agentStatus',
				render: status => this.getAgentStatusDesc(status)
			},
			{
				title: '申请时间',
				dataIndex: 'createDt',
				render: createDt => (createDt ? moment(createDt).format('YYYY-MM-DD HH:mm:ss') : '')
			},
			{
				title: '操作',
				dataIndex: 'agentId',
				render: agentId => (
					<span>
						<AuthButton actionId={ACTIONIDS_CMD.UNAUDITED_AGENT_DETAIL} onClick={() => this.handleViewUnauditAgent(agentId)} style={{ marginRight: 10 }}>审核</AuthButton>
					</span>
				)
			}
		]

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleChange
		}

		const pagination = {
			current,
			total,
			onChange: this.pageChange
		}

		const tableProps = {
			columns,
			dataSource,
			pagination,
			rowSelection,
			loading,
			rowKey: 'agentId'
		}

		const modalProps = {
			handleCancel: () => {
				this.setState({
					showModal: false
				})
			},
			handleAgree: () => {
				this.setState({ showModal: false })
				this.getUnaunditedAgentList()
			},
			handleDecline: () => {
				this.setState({ showModal: false })
				this.getUnaunditedAgentList()
			},
			agentStatuses,
			agentId: modalAgentId,
			agentCategories
		}

		const searchProps = {
			value: keywordsDisplay,
			style: { width: 280 },
			onChange: this.handleSearchChange,
			onSearch: this.handleSearch,
			enterButton: '搜索'
		}

		return (
			<div className={styles['unaudite-agents']}>
				<div className='content-header'>
					<Search {...searchProps} />
				</div>
				<div className='content-body'>
					<Table {...tableProps} />
				</div>

				{ showModal && <Modal {...modalProps} /> }
			</div>
		)
	}
}

export default AgentHOC(UnauditedAgents)
