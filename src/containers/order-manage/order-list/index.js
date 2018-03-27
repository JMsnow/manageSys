import React from 'react'
import { Input, Table, Tabs, message } from 'antd'
import AuthBtn from 'components/auth-button'
import TagSelect from 'components/TagSelect'

const TabPane = Tabs.TabPane

class OrderList extends React.Component {
	state = {
		orderListData: [],
		tagSelectData: [],
		selectedTags: [],
		total: 1,
		tabType: '',
		tableLoading: false,
		textQuery: '',
		curPage: 1
	}

	componentWillMount() {
		helper.queryAllFields('order_comm_status').then((data) => {
			this.setState({
				tagSelectData: [
					{
						title: '所有分组',
						tags: [{ key: -1, desc: '全部' }, ...data.map(item => ({ key: item.columnValue, desc: item.valueDesc }))]
					}
				]
			})
		})
		this._getOrderList({
			tabType: utils.getParameterByName('tabType') || this._getFirstLoadTabType(),
			current: utils.getParameterByName('page') || 1,
			condition: {
				textQuery: utils.getParameterByName('search') || '',
				orderCommStatus: utils.getParameterByName('tag') || -1
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this._getOrderList({
				tabType: utils.getParameterByName('tabType') || this._getFirstLoadTabType(),
				current: utils.getParameterByName('page') || 1,
				condition: {
					textQuery: utils.getParameterByName('search') || '',
					orderCommStatus: utils.getParameterByName('tag') || -1
				}
			})
		}
	}

	_getOrderList= ({ tabType = '0', current = 1, size = 10, condition = { textQuery: '', orderCommStatus: '' } }) => { // 请求列表数据
		if (!tabType) return
		const reqUrl = this._getUrlByTabType(tabType)
		const reqData = { current, size, condition }

		this.setState({ tableLoading: true })
		request.send(reqUrl, reqData).then((res) => {
			this.setState({
				orderListData: res.data.records,
				curPage: res.data.current,
				textQuery: condition.textQuery,
				tabType,
				total: res.data.total,
				tableLoading: false,
				selectedTags: [+condition.orderCommStatus]
			})
		}).catch(() => {
			message.error('请求失败')
			this.setState({
				tableLoading: false
			})
		})
	}

	_getUrlByTabType = (tabType) => {
		switch (tabType) {
		case '0':
			return HTTP_CMD.ORDER_MINE
		case '1':
			return HTTP_CMD.ORDER_TEAM
		case '2':
			return HTTP_CMD.ORDER_ORG
		case '3':
			return HTTP_CMD.ORDER_CROSS_ORG
		case '4':
			return HTTP_CMD.ORDER_ALL
		default:
			return ''
		}
	}

	_getFirstLoadTabType = () => {
		const tabTypes = [
			ACTIONIDS_CMD.ORDER_MINE,
			ACTIONIDS_CMD.ORDER_TEAM,
			ACTIONIDS_CMD.ORDER_ORG,
			ACTIONIDS_CMD.ORDER_CROSS_ORG,
			ACTIONIDS_CMD.ORDER_ALL
		]
		const allActionCodes = utils.getLocalData('allActionCodes', true)
		for (let i = 0, len = tabTypes.length; i < len; i += 1) {
			if (allActionCodes.indexOf(tabTypes[i]) > -1) {
				return `${i}`
			}
		}
		return ''
	}

	handleTabChange = (tabType) => {
		this.props.history.push(
			`${this.props.match.url}?
			tabType=${tabType}&
			tag=-1&
			page=1&
			search=${''}`
		)
	}

	handleTagChange = (tags) => {
		this.props.history.push(
			`${this.props.match.url}?
			tabType=${this.state.tabType}&
			tag=${tags[0]}&
			page=1&
			search=${''}`
		)
	}

	handleView = (id) => {
		this.props.history.push(`${this.props.match.url}/order-detail/${id}`)
	}

	handleSearch = (value) => {
		this.props.history.push(
			`${this.props.match.url}?
			tabType=${this.state.tabType}&
			tag=-1&
			page=1&
			search=${value}`
		)
	}

	pageChange = (page) => {
		this.props.history.push(
			`${this.props.match.url}?
			tabType=${this.state.tabType}&
			tag=${this.state.selectedTags[0]}&
			page=${page}&
			search=${this.state.textQuery}`
		)
	}

	render() {
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderCode',
				width: '10%'
			},
			{
				title: '订单名称',
				dataIndex: 'orderName',
				width: '10%'
			},
			{
				title: '业务负责人',
				dataIndex: 'employeeDtoList',
				width: '10%',
				render: employeeDtoList => employeeDtoList.map(item => <p>{`${item.employeeName}-${item.positionName}`}</p>)
			},
			{
				title: '组织',
				dataIndex: 'boOrgDtoList',
				width: '10%',
				render: boOrgDtoList => boOrgDtoList.map(item => <p>{item.deptName}</p>)
			},
			{
				title: '代理人',
				dataIndex: 'agentName',
				width: '10%'
			},
			{
				title: '金额',
				dataIndex: 'orderAmt',
				width: '10%',
				render: orderAmt => <span>{orderAmt}元</span>
			},
			{
				title: '操作',
				dataIndex: 'orderId',
				width: '10%',
				render: id => (<div>
					<AuthBtn
						style={{ marginRight: 5 }}
						onClick={() => this.handleView(id)}
						actionId={ACTIONIDS_CMD.ORDER_DETAIL}
					>
						查看明细
					</AuthBtn>
				</div>)
			}
		]
		const { tagSelectData, selectedTags } = this.state
		const allActionCodes = utils.getLocalData('allActionCodes', true)
		return (
			<div>
				<Tabs onChange={this.handleTabChange} type='card' activeKey={this.state.tabType}>
					<TabPane tab='我的订单' key='0' disabled={allActionCodes.indexOf('A_7410') < 0} />
					<TabPane tab='我团队的订单' key='1' disabled={allActionCodes.indexOf('A_7411') < 0} />
					<TabPane tab='我组织的订单' key='2' disabled={allActionCodes.indexOf('A_7414') < 0} />
					<TabPane tab='跨组织的订单' key='3' disabled={allActionCodes.indexOf('A_7415') < 0} />
					<TabPane tab='所有订单' key='4' disabled={allActionCodes.indexOf('A_7412') < 0} />
				</Tabs>
				<TagSelect
					dataSource={tagSelectData}
					selectedTags={selectedTags}
					onChange={this.handleTagChange}
				/>
				<div style={{ margin: '20px -25px 20px -25px', background: '#f0f2f5', height: 20 }} />
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Input.Search
						placeholder='请输入关键字搜索'
						style={{ width: 200 }}
						value={this.state.textQuery}
						onChange={e => this.setState({ textQuery: e.target.value })}
						onSearch={this.handleSearch}
					/>
				</div>
				<div style={{ marginTop: 20 }}>
					<div>
						<Table
							rowKey='orderId'
							loading={this.state.tableLoading}
							columns={columns}
							dataSource={this.state.orderListData}
							pagination={{ total: this.state.total, onChange: this.pageChange, current: this.state.curPage }}
						/>
					</div>
				</div>
			</div>
		)
	}
}
export default OrderList
