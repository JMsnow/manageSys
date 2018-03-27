import React, { Component } from 'react'
import { Input, Table, message } from 'antd'
import AuthButton from 'components/auth-button'

const Search = Input.Search

class RebateAbnormalList extends Component {
	state = {
		total: 0,
		current: 1,
		pageSize: 10,
		dataSource: [],
		selectedRowKeys: [],
		loading: false,
		textQuery: '',
		queryDisplay: '',
		orderStatuses: [],
		orderCommStatuses: []
	}

	componentWillMount() {
		const search = this.props.location.search
		this.exactParams(search, true)

		request.send(HTTP_CMD.DICT_LIST, { columnName: 'order_comm_status' }).then((res) => {
			this.setState({
				orderCommStatuses: res.data
			})
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const search = nextProps.location.search
			this.exactParams(search)
		}
	}

	getRebateAbnormalList() {
		const {
			current,
			pageSize,
			textQuery
		} = this.state

		this.setState({
			loading: true,
			selectedRowKeys: []
		})

		request.send(HTTP_CMD.REBATE_ABNORMAL_LIST, {
			current,
			size: pageSize,
			condition: {
				textQuery
			}
		}).then((res) => {
			const {
				records,
				total
			} = res.data

			this.setState({
				total,
				dataSource: records,
				loading: false
			})
		}).catch(() => {
			this.setState({
				loading: false,
				dataSource: []
			})
		})
	}

	getOrderCommStatusDesc = (status) => {
		if (isNaN(status)) return ''
		const { orderCommStatuses } = this.state
		const item = orderCommStatuses.find(_ => _.columnValue === +status)

		return item ? item.valueDesc : status
	}

	exactParams(search, changeQueryDisplay) {
		const current = +(utils.getParameterByName('current', search) || 1)
		const textQuery = utils.getParameterByName('query', search) || ''

		if (changeQueryDisplay) this.setState({ queryDisplay: textQuery })

		this.setState({
			current,
			textQuery
		}, () => {
			this.getRebateAbnormalList()
		})
	}

	handleQueryChange = (e) => {
		this.setState({
			queryDisplay: e.target.value
		})
	}

	handleQuerySearch = (value) => {
		this.setState({
			textQuery: value
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

	handleResetRebate = (orderId) => {
		helper.confirm('确定要将此订单重新返佣吗？').then(() => {
			request.send(HTTP_CMD.RESET_REBATE, { orderId }).then(() => {
				message.success('订单重新返佣成功')
				this.getRebateAbnormalList()
			}).catch(() => {
				message.error('订单重新返佣失败')
			})
		})
	}

	handleViewOrderDetail = (orderId) => {
		const { history } = this.props
		history.push(`/app/order-manage/order-detail/${orderId}?inner`)
	}

	changeUrlSearch = () => {
		const {
			textQuery,
			current
		} = this.state

		const params = {
			query: textQuery,
			current
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
			queryDisplay
		} = this.state

		const searchProps = {
			style: { width: 250 },
			value: queryDisplay,
			onChange: this.handleQueryChange,
			onSearch: this.handleQuerySearch
		}

		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderCode'
			},
			{
				title: '订单金额',
				dataIndex: 'orderAmt'
			},
			{
				title: '代理人',
				dataIndex: 'agentName'
			},
			{
				title: '接单时间',
				dataIndex: 'orderDt'
			},
			{
				title: '状态',
				dataIndex: 'orderCommStatus',
				render: status => this.getOrderCommStatusDesc(status)
			},
			{
				title: '错误信息',
				dataIndex: 'commExceptionNote',
				width: '20%',
				render: exception => (exception || '').split('\n')[0]
			},
			{
				title: '操作',
				dataIndex: 'orderId',
				width: 220,
				render: (orderId, record) => (
					<span>
						<AuthButton actionId={ACTIONIDS_CMD.REBATE_EXCEPTION_ORDER_DETAIL} onClick={() => this.handleViewOrderDetail(orderId)} style={{ marginRight: 10 }}>查看订单</AuthButton>
						<AuthButton actionId={ACTIONIDS_CMD.RECAL_REBATE} onClick={() => this.handleResetRebate(orderId)} disabled={record.orderCommStatus === -1}>重新返佣</AuthButton>
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
			rowKey: 'orderId'
		}

		return (
			<div>
				<div className='g__block_flex_space-between'>
					<Search {...searchProps} />
				</div>
				<div style={{ marginTop: 20 }}>
					<Table {...tableProps} />
				</div>
			</div>
		)
	}
}

export default RebateAbnormalList
