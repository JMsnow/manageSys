import React, { Component } from 'react'
import { Modal, Table, Button, Row, Col } from 'antd'
import moment from 'moment'

class modal extends Component {
	state = {
		dataSource: [],
		loading: false,
		products: [],
		customerName: ''
	}

	componentWillMount() {
		const {
			order: { details = [], customerId }
		} = this.props

		const productIds = []

		details.forEach((product) => {
			const { productId } = product

			if (productIds.indexOf(productId) === -1) productIds.push(productId)
		})

		if (customerId) {
			request.send(HTTP_CMD.USER_DETAIL, { userId: customerId }).then((res) => {
				this.setState({ customerName: res.data.nickName })
			})
		}

		if (!productIds.length) return

		request.send(HTTP_CMD.PRODUCT_COLLECTION, { productIdList: productIds })
			.then((res) => {
				this.setState({
					loading: false,
					dataSource: details,
					products: res.data
				})
			}).catch(() => {
				this.setState({
					loading: false
				})
			})
	}

	getProductName = (productId) => {
		const {
			products
		} = this.state
		const product = products.find(_ => _.productId === +productId)

		return product ? product.productName : productId
	}

	render() {
		const {
			dataSource,
			loading,
			customerName
		} = this.state

		const {
			getAgentName,
			order: {
				agentId,
				createDt,
				orderCode
			}
		} = this.props

		const columns = [
			{
				title: '产品编号',
				dataIndex: 'productId',
				width: '14%'
			},
			{
				title: '产品名称',
				dataIndex: 'productName',
				width: '14%',
				render: (val, record) => this.getProductName(record.productId)
			},
			{
				title: '市场价格',
				dataIndex: 'itemPrice',
				width: '14%'
			},
			{
				title: '商品数量',
				dataIndex: 'itemQuatity',
				width: '14%'
			},
			{
				title: '应付金额',
				dataIndex: 'itemAmt',
				width: '14%',
				render: value => <span>{value}元</span>
			},
			{
				title: '折扣',
				dataIndex: 'itemSales',
				width: '15%',
				render: value => <span>{`${value * 100}%`}</span>
			},
			{
				title: '实付金额',
				dataIndex: 'itemRealAmt',
				width: '15%',
				render: value => <span>{value}元</span>
			}
		]

		const tableProps = {
			columns,
			loading,
			dataSource,
			bordered: true,
			pagination: false,
			rowKey: 'productId'
		}

		const modalProps = {
			title: '订单明细',
			visible: true,
			closable: false,
			footer: <Button onClick={() => this.props.onClose()}>关闭</Button>
		}

		return (
			<Modal {...modalProps}>
				<div style={{ marginBottom: 20 }}>
					<Row style={{ lineHeight: 3 }}>
						<Col span={12}>
							<p>订单编号：{orderCode}</p>
						</Col>
						<Col span={12}>
							<p>创建时间：{moment(createDt).format('YYYY-MM-DD HH:mm:ss')}</p>
						</Col>
						<Col span={12}>
							<p>客户联系人：{customerName}</p>
						</Col>
						<Col span={12}>
							<p>代理人：{getAgentName(agentId)}</p>
						</Col>
					</Row>
				</div>
				<Table {...tableProps} />
			</Modal>
		)
	}
}

export default modal
