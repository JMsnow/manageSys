import React, { Component } from 'react'
import { Input, Button, Table, message } from 'antd'
import moment from 'moment'
import AuthButton from 'components/auth-button'
import Modal from './Modal'

const Search = Input.Search

class OrderAbnormalList extends Component {
	state = {
		total: 0,
		current: 1,
		pageSize: 10,
		dataSource: [],
		selectedRowKeys: [],
		loading: false,
		keywords: '',
		keywordsDisplay: '',
		agents: [],
		showModal: false,
		order: null
	}

	componentWillMount() {
		const search = this.props.location.search
		this.extractParams(search, true)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const search = nextProps.location.search
			this.extractParams(search)
		}
	}

	getOrderList() {
		const {
			current,
			keywords,
			pageSize
		} = this.state

		this.setState({
			loading: true,
			selectedRowKeys: []
		})

		request.send(HTTP_CMD.ORDER_ABNORMAL_LIST, {
			current,
			size: pageSize,
			condition: {
				keywords
			}
		}).then((res) => {
			const {
				records,
				total
			} = res.data

			const agentIds = []

			const dataSource = records.map((record) => {
				const {
					dataDomain,
					...other
				} = record

				const orderBase = JSON.parse(dataDomain)
				const agentId = orderBase.agentId

				if (agentId && agentIds.indexOf(agentId) === -1) {
					agentIds.push(orderBase.agentId)
				}

				return {
					...other,
					...orderBase
				}
			})

			this.getAgentInfo(agentIds, () => {
				this.setState({
					total,
					dataSource,
					loading: false
				})
			}, () => {
				this.setState({
					loading: false,
					dataSource: []
				})
			})
		}).catch(() => {
			this.setState({
				loading: false,
				dataSource: []
			})
		})
	}

	getAgentNameById = (agentId) => {
		const { agents } = this.state
		const agent = agents.find(_ => _.agentId === agentId)

		return agent ? agent.contactName : ''
	}

	getAgentInfo(agentIds, sucCallback, errCallback) {
		request.send(HTTP_CMD.AGENT_COLLECTION, { agentIdList: agentIds }).then((res) => {
			this.setState({ agents: res.data })

			if (typeof sucCallback === 'function') sucCallback()
		}).catch(() => {
			if (typeof errCallback === 'function') errCallback()
		})
	}

	extractParams(search, changeDisplayKeywords) {
		const current = +(utils.getParameterByName('current', search) || 1)
		const keywords = utils.getParameterByName('keywords', search) || ''

		if (changeDisplayKeywords) this.setState({ keywordsDisplay: keywords })

		this.setState({
			current,
			keywords
		}, () => {
			this.getOrderList()
		})
	}

	handleQueryChange = (e) => {
		this.setState({
			keywordsDisplay: e.target.value
		})
	}

	handleQuerySearch = (val) => {
		this.setState({
			keywords: val
		}, () => {
			this.changeUrlSearch()
		})
	}

	handlePageChange = (page) => {
		this.setState({
			current: page
		}, () => {
			this.changeUrlSearch()
		})
	}

	handleSelectionChange = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys
		})
	}

	handleRecleanOrder = (landingId) => {
		helper.confirm('确定要重新清洗此订单吗？').then(() => {
			request.send(HTTP_CMD.ORDER_RECLEAN, { landingId }).then(() => {
				message.success('订单重新清洗成功')
				this.getOrderList()
			}).catch(() => {
				message.error('订单重新清洗失败')
			})
		})
	}

	handleViewOrderDetail = (order) => {
		this.setState({
			showModal: true,
			order
		})
	}

	changeUrlSearch() {
		const {
			current,
			keywords
		} = this.state

		const params = {
			current,
			keywords
		}

		const search = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
		const {
			history,
			match: { url }
		} = this.props
		history.push(`${url}?${search}`)
	}

	render() {
		const {
			total,
			current,
			pageSize,
			dataSource,
			selectedRowKeys,
			loading,
			keywordsDisplay,
			showModal,
			order
		} = this.state

		const searchProps = {
			style: { width: 250 },
			value: keywordsDisplay,
			onChange: this.handleQueryChange,
			onSearch: this.handleQuerySearch
		}

		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderCode'
			},
			{
				title: '金额',
				dataIndex: 'orderAmt'
			},
			{
				title: '代理人',
				dataIndex: 'agentId',
				render: agentId => this.getAgentNameById(agentId)
			},
			{
				title: '接单时间',
				dataIndex: 'createDt',
				render: createDt => moment(createDt).format('YYYY-MM-DD HH:mm:ss')
			},
			{
				title: '错误代码',
				dataIndex: 'dataStatus'
			},
			{
				title: '错误信息',
				dataIndex: 'remark'
			},
			{
				title: '操作',
				dataIndex: 'orderId',
				width: 220,
				render: (orderId, record) => (
					<span>
						<Button onClick={() => this.handleViewOrderDetail(record)} style={{ marginRight: 10 }}>订单明细</Button>
						<AuthButton actionId={ACTIONIDS_CMD.ORDER_RECLEAN} onClick={() => this.handleRecleanOrder(record.landingId)}>重新清洗</AuthButton>
					</span>
				)
			}
		]

		const pagination = {
			total,
			current,
			pageSize,
			onChange: this.handlePageChange
		}

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleSelectionChange
		}

		const tableProps = {
			columns,
			pagination,
			rowSelection,
			loading,
			dataSource,
			rowKey: 'landingId'
		}

		const modalProps = {
			order,
			getAgentName: agentId => this.getAgentNameById(agentId),
			onClose: () => {
				this.setState({
					showModal: false
				})
			}
		}

		return (
			<div>
				<div className='g__block_flex_space-between'>
					<Search {...searchProps} />
				</div>
				<div style={{ marginTop: 20 }}>
					<Table {...tableProps} />
				</div>
				{ showModal && <Modal {...modalProps} /> }
			</div>
		)
	}
}

export default OrderAbnormalList
