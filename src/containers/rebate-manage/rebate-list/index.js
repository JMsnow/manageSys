import React, { Component } from 'react'
import { Input, Button, Table, Tag, Card, message, Tabs } from 'antd'
import { RebateHOC } from 'components/connect'
import moment from 'moment'
import AuthButton from 'components/auth-button'

import styles from './index.scss'

const Search = Input.Search
const CheckableTag = Tag.CheckableTag
const TabPane = Tabs.TabPane

class rebateList extends Component {
	constructor(props) {
		super(props)

		const tabPanels = [
			{
				tabName: '我的返佣',
				key: '0',
				actionId: 'A_11405'
			},
			{
				tabName: '我团队的返佣',
				key: '1',
				actionId: 'A_11406'
			},
			{
				tabName: '我组织的返佣',
				key: '2',
				actionId: 'A_11407'
			},
			{
				tabName: '跨组织的返佣',
				key: '3',
				actionId: 'A_11408'
			},
			{
				tabName: '所有返佣',
				key: '4',
				actionId: 'A_11401'
			}
		]

		const allActionCodes = utils.getLocalData('allActionCodes', true)
		this.visibleTabPanels = tabPanels.filter(panel => (
			allActionCodes.indexOf(panel.actionId) > 0
		))
	}

	state = {
		total: 0,
		current: 1,
		pageSize: 10,
		dataSource: [],
		selectedRowKeys: [],
		loading: false,
		status: -1,
		query: '',
		queryDisplay: ''
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

	getRebateList = () => {
		const {
			current,
			status,
			query,
			pageSize,
			tabType
		} = this.state

		this.setState({
			loading: true,
			selectedRowKeys: []
		})

		const url = this._getUrlByTabType(tabType)

		request.send(url, {
			current,
			size: pageSize,
			condition: {
				textQuery: query,
				commSettleStatus: +status < 0 ? '' : status
			}
		}).then((res) => {
			const { records, total } = res.data
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

	getRebateStatusDesc = (status) => {
		if (isNaN(status)) return ''

		const {
			settleStatus: { settleStatuses }
		} = this.props
		const item = settleStatuses.find(_ => _.columnValue === +status)

		return item ? item.valueDesc : status
	}

	_getUrlByTabType = (tabType) => {
		switch (tabType) {
		case '0':
			return HTTP_CMD.REBATE_MINE
		case '1':
			return HTTP_CMD.REBATE_MINE_TEAM
		case '2':
			return HTTP_CMD.REBATE_MINE_ORG
		case '3':
			return HTTP_CMD.REBATE_CROSS_ORG
		case '4':
			return HTTP_CMD.REBATE_ALL
		default:
			return ''
		}
	}

	extractParams(search, changeQueryDisplay) {
		const current = +(utils.getParameterByName('current', search) || 1)
		const status = utils.getParameterByName('status', search) || -1
		const query = utils.getParameterByName('query', search) || ''
		const tabType = utils.getParameterByName('tabType') || this.visibleTabPanels[0].key

		if (changeQueryDisplay) this.setState({ queryDisplay: query })

		this.setState({
			current,
			status,
			query,
			tabType
		}, () => {
			this.getRebateList()
		})
	}

	changeUrlSearch() {
		this.setState({
			selectedRowKeys: []
		})
		const {
			current,
			status,
			query,
			tabType
		} = this.state
		const params = {
			current,
			status,
			query,
			tabType
		}
		const search = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
		const {
			history,
			match: { url }
		} = this.props

		history.push(`${url}?${search}`)
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

	handleTagChange = (tag, checked) => {
		if (!checked) return

		this.setState({
			status: tag
		}, () => {
			this.changeUrlSearch()
		})
	}

	handleViewOrderDetail = (orderId) => {
		const { history } = this.props
		history.push(`/app/order-manage/order-detail/${orderId}?inner`)
	}

	handleQueryChange = (e) => {
		this.setState({
			queryDisplay: e.target.value
		})
	}

	handleSearch = (val) => {
		this.setState({
			query: val,
			status: -1,
			current: 1
		}, () => {
			this.changeUrlSearch()
		})
	}

	handleAbondonRebateItem = (transactionId) => {
		helper.confirm('确定要废弃此条返佣明细记录吗？').then(() => {
			request.send(HTTP_CMD.REBATE_ABONDON, {
				transactionId,
				commSettleStatus: 3
			}).then(() => {
				message.success('分佣明细废弃成功')
				this.getRebateList()
			}).catch((res) => {
				message.error(res.msg)
			})
		})
	}

	handleSettleRebateItem = (transactionId) => {
		helper.confirm('确定要结算此返佣明细记录吗？').then(() => {
			request.send(HTTP_CMD.REBATE_SETTLE, { transactionId }).then(() => {
				message.success('分佣明细结算成功')
				this.getRebateList()
			}).catch((res) => {
				message.error(res.msg)
			})
		})
	}

	handleTabChange = (tabType) => {
		this.setState({
			tabType,
			current: 1,
			status: -1
		}, () => {
			this.changeUrlSearch()
		})
	}

	handleViewOrderRuleItem = (record) => {
		const { history } = this.props
		const { commRuleId, commRuleItemId } = record
		history.push(`/app/rules-manage/rules-detail/${commRuleId}?ruleItemId=${commRuleItemId}`)
	}

	render() {
		const {
			settleStatus: { settleStatuses }
		} = this.props

		const {
			total,
			current,
			selectedRowKeys,
			loading,
			dataSource,
			status,
			queryDisplay,
			tabType
		} = this.state

		const columns = [
			{
				title: '返佣编号',
				dataIndex: 'transactionId'
			},
			{
				title: '返佣对象',
				dataIndex: 'contactName'
			},
			{
				title: '返佣金额',
				dataIndex: 'commAmt'
			},
			{
				title: '返佣时间',
				dataIndex: 'realAcctDt',
				render: date => (
					date ? moment(date).format('YYYY-MM-DD') : ''
				)
			},
			{
				title: '预处理时间',
				dataIndex: 'planAcctDt',
				render: date => (
					date ? moment(date).format('YYYY-MM-DD') : ''
				)
			},
			{
				title: '订单编号',
				dataIndex: 'orderId'
			},
			{
				title: '结算状态',
				dataIndex: 'commSettleStatus',
				render: settleStatus => this.getRebateStatusDesc(settleStatus)
			},
			{
				title: '操作',
				key: 'operation',
				render: (text, record) => (
					<span>
						<Button onClick={() => this.handleViewOrderDetail(record.orderId)} style={{ marginRight: 10 }}>查看订单明细</Button>
						<Button onClick={() => this.handleViewOrderRuleItem(record)} style={{ marginRight: 10 }}>查看适用的分佣规则</Button>
						<AuthButton actionId={ACTIONIDS_CMD.REBATE_ABONDON} onClick={() => this.handleAbondonRebateItem(record.transactionId)} style={{ marginRight: 10 }} disabled={record.commSettleStatus === 3}>废弃</AuthButton>
						<AuthButton actionId={ACTIONIDS_CMD.REBATE_SETTLE} onClick={() => this.handleSettleRebateItem(record.transactionId)} disabled={record.commSettleStatus !== 2}>结算</AuthButton>
					</span>
				)
			}
		]

		const pagination = {
			total,
			current,
			onChange: this.handlePageChange
		}

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleSelectionChange
		}

		const searchProps = {
			style: { width: 250 },
			value: queryDisplay,
			onChange: this.handleQueryChange,
			onSearch: this.handleSearch,
			enterButton: '搜索'
		}

		const tableProps = {
			columns,
			pagination,
			loading,
			dataSource,
			rowSelection,
			rowKey: 'transactionId'
		}

		const cardProps = {
			bodyStyle: { padding: 20 }
		}

		return (
			<div className={styles['content-inner']}>
				<Tabs onChange={this.handleTabChange} type='card' activeKey={tabType}>
					{ this.visibleTabPanels.map(tab => <TabPane tab={tab.tabName} key={tab.key} />)}
				</Tabs>
				<div className='content-header'>
					<Search {...searchProps} />
					<div>
						<Button key='export' type='primary' disabled={selectedRowKeys.length < 1}>导出</Button>
					</div>
				</div>
				<div className='content-body'>
					<Card {...cardProps}>
						<div className='filter-item'>
							<div className='filter-label'><span>所有分组:</span></div>
							<div className='filter-range'>
								<CheckableTag
									key={-1}
									checked={+status === -1}
									onChange={checked => this.handleTagChange(-1, checked)}
								>全部</CheckableTag>
								{settleStatuses.map(settleStatus => (
									<CheckableTag
										key={settleStatus.columnValue}
										checked={+status === settleStatus.columnValue}
										onChange={checked => this.handleTagChange(settleStatus.columnValue, checked)}
									>
										{settleStatus.valueDesc}
									</CheckableTag>
								))}
							</div>
						</div>
					</Card>
					<div className='rebate-list'>
						<Table {...tableProps} />
					</div>
				</div>
			</div>
		)
	}
}

export default RebateHOC(rebateList)
