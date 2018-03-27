import React, { Component } from 'react'
import { Input, Card, Tag, Table, message } from 'antd'
import moment from 'moment'
import AuthButton from 'components/auth-button'

import styles from './index.scss'

const Search = Input.Search
const CheckableTag = Tag.CheckableTag

class OrderList extends Component {
	state = {
		total: 0,
		current: 1,
		dataSource: [],
		pageSize: 10,
		loading: false,
		selectedRowKeys: [],
		orderCommStatuses: [],
		keywords: '',
		keywordsDisplay: '',
		requestLoading: false
	}

	componentWillMount() {
		const search = this.props.location.search
		this.extractParams(search, true)

		helper.queryAllFields('order_comm_status')
			.then((data) => {
				this.setState({ orderCommStatuses: data })
			})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const search = nextProps.location.search
			this.extractParams(search)
		}
	}

	getOrderStatusDesc = (status) => {
		if (isNaN(status)) return ''
		const { orderCommStatuses } = this.state
		const item = orderCommStatuses.find(_ => _.columnValue === +status)

		return item ? item.valueDesc : status
	}

	getOrderList() {
		const {
			current,
			status,
			pageSize,
			keywords
		} = this.state

		const params = {
			current,
			size: pageSize,
			condition: {
				keywords,
				...(status === -10 ? {} : { orderCommStatusList: [status] })
			}
		}

		this.setState({
			loading: true,
			selectedRowKeys: []
		})

		request.send(HTTP_CMD.REBATE_ORDER_LIST, params).then((res) => {
			const {
				records,
				total
			} = res.data

			this.setState({
				loading: false,
				dataSource: records,
				total
			})
		}).catch(() => {
			this.setState({
				loading: false,
				dataSource: []
			})
		})
	}

	handleSearch = (val) => {
		this.setState({
			keywords: val
		}, () => {
			this.changeUrlSearch()
		})
	}

	handleTagChange = (tag, checked) => {
		if (!checked) return

		this.setState({
			status: tag
		}, () => {
			this.changeUrlSearch()
		})
	}

	handleChange = (e) => {
		this.setState({
			keywordsDisplay: e.target.value
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

	handleCalRebate = (orderId) => {
		helper.confirm('确定要计算此订单明细的返佣吗？').then(() => {
			this.setState({ requestLoading: true })

			request.send(HTTP_CMD.CALC_REBATE, { orderId }).then(() => {
				this.setState({ requestLoading: false })
				message.success('计算返佣成功')
				this.getOrderList()
			}).catch(() => {
				this.setState({ requestLoading: false })
				message.error('计算返佣异常')
			})
		})
	}

	handleDeleteOrder = (orderId) => {
		helper.confirm('确定要删除此订单明细吗？').then(() => {
			request.send(HTTP_CMD.ORDER_DETAIL_DELETE, { orderItemId: orderId }).then(() => {
				message.success('订单明细删除成功')
				this.getOrderList()
			}).catch(() => {
				message.error('订单明细删除失败')
			})
		})
	}

	changeUrlSearch() {
		this.setState({
			selectedRowKeys: []
		})
		const {
			current,
			status,
			keywords
		} = this.state
		const params = {
			current,
			status,
			keywords
		}
		const search = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
		const {
			history,
			match: { url }
		} = this.props

		history.push(`${url}?${search}`)
	}

	extractParams(search, changeKeywordsDisplay) {
		const current = +(utils.getParameterByName('current', search) || 1)
		const status = +(utils.getParameterByName('status', search) || -10)
		const keywords = utils.getParameterByName('keywords', search) || ''

		if (changeKeywordsDisplay) this.setState({ keywordsDisplay: keywords })

		this.setState({
			current,
			status,
			keywords
		}, () => {
			this.getOrderList()
		})
	}

	render() {
		const {
			total,
			current,
			dataSource,
			loading,
			pageSize,
			status,
			keywordsDisplay,
			selectedRowKeys,
			orderCommStatuses,
			requestLoading
		} = this.state

		const searchProps = {
			style: { width: 250 },
			value: keywordsDisplay,
			onChange: this.handleChange,
			onSearch: this.handleSearch
		}

		const cardProps = {
			bodyStyle: { padding: 20 }
		}

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

		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderItemNo'
			},
			{
				title: '产品编号',
				dataIndex: 'productCode'
			},
			{
				title: '产品名称',
				dataIndex: 'productName'
			},
			{
				title: '数量',
				dataIndex: 'itemQuatity'
			},
			{
				title: '金额',
				dataIndex: 'itemAmt'
			},
			{
				title: '代理人',
				dataIndex: 'contactName'
			},
			{
				title: '接单时间',
				dataIndex: 'orderDt',
				render: orderDt => (orderDt ? moment(orderDt).format('YYYY-MM-DD HH:mm:ss') : '')
			},
			{
				title: '状态',
				dataIndex: 'orderCommStatus',
				render: orderStatus => this.getOrderStatusDesc(orderStatus)
			},
			{
				title: '负责人',
				dataIndex: 'employeeNameList',
				render: employeeNameList => (employeeNameList || []).map(item => <p>{item}</p>)
			},
			{
				title: '操作',
				dataIndex: 'orderItemId',
				width: 200,
				render: (orderItemId, record) => (
					<span>
						<AuthButton style={{ marginRight: 10 }} onClick={() => this.handleDeleteOrder(orderItemId)} actionId={ACTIONIDS_CMD.REBATE_ORDER_DELETE} disabled={record.orderCommStatus === 0}>删除</AuthButton>
						<AuthButton actionId={ACTIONIDS_CMD.REBATE_CALC} onClick={() => this.handleCalRebate(orderItemId)} loading={requestLoading} disabled={record.orderCommStatus === 0}>计算返佣</AuthButton>
					</span>
				)
			}
		]

		const tableProps = {
			loading,
			columns,
			dataSource,
			pagination,
			rowSelection,
			rowKey: 'orderId'
		}

		return (
			<div className={styles['content-inner']}>
				<div className='content-header'>
					<Search {...searchProps} />
				</div>
				<div className='content-body'>
					<Card {...cardProps}>
						<div className='filter-item'>
							<div className='filter-label'><span>所有分组:</span></div>
							<div className='filter-range'>
								<CheckableTag
									key={-10}
									checked={+status === -10}
									onChange={checked => this.handleTagChange(-10, checked)}
								>全部</CheckableTag>
								{orderCommStatuses.map(commStatus => (
									<CheckableTag
										key={commStatus.columnValue}
										checked={+status === commStatus.columnValue}
										onChange={checked => this.handleTagChange(commStatus.columnValue, checked)}
									>{commStatus.valueDesc}</CheckableTag>
								))}
							</div>
						</div>
					</Card>
					<div className='order-list'>
						<Table {...tableProps} />
					</div>
				</div>
			</div>
		)
	}
}

export default OrderList
