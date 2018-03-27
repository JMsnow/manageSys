import React from 'react'
import { Button, Tabs, message } from 'antd'
import renderReactNode from 'utils/render-react-node'
import style from './style.scss'

import GoBack from 'components/go-back'
import LogsModal from './logs-modal'
import OrderDetail from './order-detail'
import PayRecord from './pay-record'

export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tabType: '0',
			loading: false,
			orderInfo: {},
			visitorData: [{key: 1, orderId: 1}]
		}
	}
	componentWillMount() {
		this.init()
	}
	onTabChange = (tabType) => {
		this.setState({
			tabType
		})
	}
	showLogsModal = () => {
		renderReactNode({
			getContent: ({ destroy }) => {
				const opts = {
					destroy,
					id: this.props.id
				}
				return <LogsModal {...opts} />
			}
		})
	}
	onUpdateVisitorData = (data) => {
		const orderId = data.orderId
		this.setState(prevState => {
			const index = prevState.visitorData.findIndex(value => value.orderId === orderId)
			const newData = [...prevState.visitorData]
			newData[index] = data
			return {
				visitorData: newData
			}
		})
	}
	queryData = async () => {
		const { match } = this.props

		try {
			this.setState({ loading: true })
			const { data } = await request.send(`/order/admin/detail/${match.params.id}`, {})
			if (data) {
				this.setState({
					orderInfo: data,
					visitorData: (data.orderTourists || []).map((v, i) => ({...v, key: i}))
				})
			}
		} catch (e) {
			message.error('请求失败')
		} finally {
			this.setState({ loading: false })
		}
	}
	init = async () => {
		await this.queryData()
	}
	render() {
		const { match } = this.props
		const { loading, orderInfo, visitorData } = this.state
		const operations = (
			<React.Fragment>
				<Button onClick={this.showLogsModal} style={{ marginRight: 12 }}>系统日志</Button>
				<GoBack {...this.props} />
			</React.Fragment>
		)
		return (
			<div className={style.index}>
				<Tabs onChange={this.onTabChange} type='card' activeKey={this.state.tabType} tabBarExtraContent={operations}>
					<Tabs.TabPane tab="订单详情" key="0">
						<OrderDetail loading={loading} orderInfo={orderInfo} visitorData={visitorData} onUpdateVisitorData={this.onUpdateVisitorData} />
					</Tabs.TabPane>
					<Tabs.TabPane tab="支付与凭证记录" key="1">
						<PayRecord id={match.params.id} loading={loading} orderInfo={orderInfo} />
					</Tabs.TabPane>
				</Tabs>
			</div>
		)
	}
}
