import React from 'react'
import { Table, Tabs, message, Menu, Button, Dropdown, Icon } from 'antd'
import renderReactNode from 'utils/render-react-node'
import createSearchForm from 'components/advanced-search-form'
import style from './style.scss'
import { ORDER_ALTER_KEY, fieldDecoratorMap, columnMap } from './pub'
import AlterVisitorModal from './alter-visitor-modal'

function fmtRangePicker(arr) {
	const [start, end] = arr || []
	return [start && start.format('YYYY-MM-DD'), end && end.format('YYYY-MM-DD')]
}
export default class extends React.Component {
	constructor(props) {
		super(props)
		this.tabTypeList = [
			{
				key: 'all',
				text: '全部订单',
				value: '',
				url: '/order-service/order/admin/allPageList',
				actionCode: '',
				form:(({ validateFields }) => {
					const fieldDecorator = [
						[
							fieldDecoratorMap.buyerChannel,
							fieldDecoratorMap.orderStatus,
							fieldDecoratorMap.paymentType,
							fieldDecoratorMap.orderType
						],
						[
							fieldDecoratorMap.product,
							fieldDecoratorMap.goGroupDate,
							fieldDecoratorMap.backGroupDate,
							fieldDecoratorMap.orderDate
						],
						[
							fieldDecoratorMap.visitorName,
							fieldDecoratorMap.visitorPhone,
							fieldDecoratorMap.orderPerson,
							fieldDecoratorMap.orderNo
						],
						[
							fieldDecoratorMap.groupNo,
							{
								isOperate: true,
								colProps: { span: 6, push: 12 }
							}
						]
					]
					const SearchForm = createSearchForm(
						{
							fieldDecorator,
							validateFields,
							isOperateShow: false
						}
					)
					return <SearchForm />
				})(this),
				columns: [
					{
						...columnMap.productInfo,
						width: '40%'
					},
					{
						...columnMap.buyerSale,
						width: '20%'
					},
					{
						...columnMap.orderStatus,
						width: '20%'
					},
					{
						title: '订单操作',
						dataIndex: '订单操作',
						width: '10%',
						render: (text, record) =>  {
							const menu = (
								<Menu onClick={(e) => this.onOrderAlter(e, record)}>
									<Menu.Item key={ORDER_ALTER_KEY.cancelOrder}>取消订单</Menu.Item>
									{
										// <Menu.Item key={ORDER_ALTER_KEY.alertVisitor}>编辑游客</Menu.Item>
									}
								</Menu>
							)
							return (
								<React.Fragment>
									<div className={style.expand_head} />
									<div className={`${style.expand_body} ${style.text_center}`}>
										<Button type="primary" className={style.detail_btn} onClick={() => {this.onOrderDetail(record)}}>订单详情</Button>
										<br/>
										{
											/*(
												<Dropdown overlay={menu}>
													<Button className={style.order_alter}>
														订单修改 <Icon type="down" />
													</Button>
												</Dropdown>
											)*/
										}

									</div>
								</React.Fragment>
							)
						}
					}
				]
			},
			{
				key: 'stayFollow',
				text: '待跟进订单',
				value: '',
				url: '/order/admin/waitPageList',
				actionCode: '',
				form: (({ validateFields }) => {
					const fieldDecorator = [
						[
							fieldDecoratorMap.product,
							fieldDecoratorMap.orderStatus,
							fieldDecoratorMap.paymentType,
							fieldDecoratorMap.orderType
						],
						[
							fieldDecoratorMap.orderDate,
							fieldDecoratorMap.goGroupDate,
							fieldDecoratorMap.backGroupDate,
							fieldDecoratorMap.sortType
						],
						[
							fieldDecoratorMap.visitorName,
							fieldDecoratorMap.visitorPhone,
							fieldDecoratorMap.orderPerson,
							fieldDecoratorMap.orderNo
						],
						[
							fieldDecoratorMap.groupNo,
							{
								isOperate: true,
								colProps: { span: 6, push: 12 }
							}
						]
					]
					const SearchForm = createSearchForm(
						{
							fieldDecorator,
							validateFields,
							isOperateShow: false
						}
					)
					return <SearchForm />
				})(this),
				columns: [
					{
						...columnMap.productInfo,
						width: '40%'
					},
					{
						...columnMap.buyerSale,
						width: '20%'
					},
					{
						...columnMap.orderStatus,
						width: '20%'
					},
					{
						...columnMap.serviceDemand,
						width: '10%'
					},
					{
						title: '订单操作',
						dataIndex: '订单操作',
						width: '10%',
						render: (text, record) => {
							const menu = (
								<Menu onClick={(e) => this.onOrderAlter(e, record)}>
									<Menu.Item key={ORDER_ALTER_KEY.completeFollowing}>完成跟进</Menu.Item>
								</Menu>
							)
							return (
								<React.Fragment>
									<div className={style.expand_head} />
									<div className={`${style.expand_body} ${style.text_center}`}>
										<Button type="primary" className={style.detail_btn} onClick={() => {this.onOrderDetail(record)}}>订单详情</Button>
										<br/>
										<Dropdown overlay={menu} className={style.order_alter}>
											<Button style={{ marginLeft: 8 }}>
												订单修改 <Icon type="down" />
											</Button>
										</Dropdown>
									</div>
								</React.Fragment>
							)
						}
					}
				]
			}
		]
		// 只显示一个全部，取消注释就可以
		this.tabTypeList = [this.tabTypeList[0]]

		this.state = {
			tabType: '',
			formModel: {},
			tableLoading: false,
			orderListData: [{ key: 1, orderNo: 5}],
			total: 1,
			curPage: 1
		}
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.match.isExact) {
			// 刷新操作
			this.queryData()
		}
	}
	getTabTypeInfo(tabType) {
		tabType = tabType || this.state.tabType
		return this.tabTypeList.find(({key}) => key === tabType) || this.tabTypeList[0]
	}
	onTabChange = (tabType) => {
		this.setState({
			tabType
		}, () => {
			this.queryData({
				tabType,
				current: 1
			})
		})
	}
	onPageChange = (page) => {
		this.queryData({
			current: page
		})
	}
	onOrderAlter = async ({ key }, record) => {
		if (key === ORDER_ALTER_KEY.alertVisitor) {
			this.showAlterVisitorModal(record)
		} else if(key === ORDER_ALTER_KEY.cancelOrder) {
			await helper.confirm('您确定要取消订单吗？')
			try {
				const { data } = await request.send('', {})
				if (data) {
					message.success('取消订单成功')
					this.queryData()
				}
			} catch (e) {
				message.error('取消订单失败')
			}
		} else if(key === ORDER_ALTER_KEY.completeFollowing) {
			await helper.confirm('您确定要完成跟进吗？')
			try {
				const { data } = await request.send('', {})
				if (data) {
					message.success('完成跟进成功')
					this.queryData()
				}
			} catch (e) {
				message.error('完成跟进失败')
			}
		}
	}
	onOrderDetail = ({ orderNo }) => {
		this.props.history.push(`${this.props.match.url}/order-detail/${orderNo}`)
	}
	validateFields = (err, { values }) => {
		if (!err) {
			console.log(values)
			this.setState({ formModel: {
				...values,
				beginDate: fmtRangePicker(values.beginDate).join(','),
				endDate: fmtRangePicker(values.endDate).join(','),
				orderTime: fmtRangePicker(values.orderTime).join(',')
			} }, () => { this.queryData() })
		}
	}
	showAlterVisitorModal = (record) => {
		renderReactNode({
			getContent: ({ destroy }) => {
				const opts = {
					destroy,
					record,
					onSuccess: () => {
						destroy()
						this.queryData()
					}
				}
				return <AlterVisitorModal {...opts} />
			}
		})
	}
	queryData = async ({ tabType, current, size = 10 } = {}) => {
		try {
			const tabTypeInfo = this.getTabTypeInfo(tabType)
			current = current || this.state.curPage

			this.setState({ tableLoading: true })
			const { data } = await request.send(tabTypeInfo.url, {
				...this.state.formModel,
				pageNo: current,
				pageSize: size
			})
			if (data) {
				this.setState({
					curPage: current,
					tabType:tabTypeInfo.key,
					total: data.paginator.totalCounts,
					orderListData: (data.list || []).map(v => ({...v, key: v.orderNo}))
				})
			}
		} catch (e) {
			message.error('请求失败')
		} finally {
			this.setState({ tableLoading: false })
		}
	}
	render() {
		const tabTypeInfo = this.getTabTypeInfo()
		return (
			<div className={style.order}>
				<Tabs onChange={this.onTabChange} type='card' activeKey={this.state.tabType}>
					{
						this.tabTypeList.map(v => <Tabs.TabPane tab={v.text} key={v.key} />)
					}
				</Tabs>

				{tabTypeInfo.form}

				<div style={{ marginTop: 20 }}>
					<div>
						<Table
							className={style.table}
							bordered
							rowKey='key'
							loading={this.state.tableLoading}
							columns={tabTypeInfo.columns}
							dataSource={this.state.orderListData}
							pagination={{ total: this.state.total, onChange: this.onPageChange, current: this.state.curPage }}
						/>
					</div>
				</div>
			</div>
		)
	}
}
