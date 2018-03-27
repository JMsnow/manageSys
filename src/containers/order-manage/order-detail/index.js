import React from 'react'
import { Row, Col, Table, message } from 'antd'
import style from './style.scss'

const DetailItem = props => (
	<Col span={8}>
		<div className='detailItem'>
			<span>{props.label}：</span>
			<span>{props.children}</span>
		</div>
	</Col>
)

class OrderDetail extends React.Component {
	state = {
		tableLoading: false,
		orderCommStatus: [],
		orderDetail: {},
		productData: []
	}

	componentWillMount() {
		this._getOrderDetail()
		helper.queryAllFields('order_comm_status').then((data) => {
			this.setState({
				orderCommStatus: data
			})
		})
	}

	_getOrderDetail = () => {
		const orderId = this.props.match.params.id
		const search = this.props.location.search
		const isInner = search.indexOf('inner') > -1
		const url = isInner ? HTTP_CMD.ORDER_DETAIL_INNER : HTTP_CMD.ORDER_DETAIL
		request.send(url, { orderId }).then((res) => {
			this.setState({
				orderDetail: res.data,
				productData: res.data.orderItemList
			})
		})
	}

	handleDeleteProduct = (orderId) => {
		helper.confirm('确定删除该产品吗？').then(() => {
			request.send(HTTP_CMD.ORDER_DELETE, { orderId })
				.then((res) => {
					message.success(res.msg)
					this._getOrderDetail()
				})
		})
	}

	render() {
		const columns = [
			{
				title: '商品编号',
				dataIndex: 'productCode',
				width: '14.2%'
			},
			{
				title: '商品名称',
				dataIndex: 'productName',
				width: '14.2%'
			},
			{
				title: '商品单价',
				dataIndex: 'itemPrice',
				width: '14.2%',
				render: value => <span>{value}元</span>
			},
			{
				title: '商品数量',
				dataIndex: 'itemQuatity',
				width: '14.2%'
			},
			{
				title: '应付金额',
				dataIndex: 'itemAmt',
				width: '14.2%',
				render: value => <span>{value}元</span>
			},
			{
				title: '折扣',
				dataIndex: 'itemSales',
				width: '14.2%',
				render: value => <span>{`${value * 100}%`}</span>
			},
			{
				title: '实付金额',
				dataIndex: 'itemRealAmt',
				width: '14.2%',
				render: value => <span>{value}元</span>
			}
		]
		const { orderDetail, orderCommStatus } = this.state
		const status = orderCommStatus.filter(item => item.columnValue === orderDetail.orderCommStatus)[0]
		return (
			<div className={style.detail}>
				<div className='detailTitle'>订单详情</div>
				<Row style={{ lineHeight: 2.5 }}>
					<DetailItem label='订单编号'>{orderDetail.orderCode}</DetailItem>
					<DetailItem label='订单名称'>{orderDetail.orderName}</DetailItem>
					<DetailItem label='创建时间'>{orderDetail.createDt}</DetailItem>
					<DetailItem label='订单金额'>{orderDetail.orderAmt}元</DetailItem>
					<DetailItem label='代理人'>{orderDetail.agentName}</DetailItem>
					<DetailItem label='备注'>{orderDetail.orderDesc}</DetailItem>
					<DetailItem label='客户联系人'>{orderDetail.customerName}</DetailItem>
					<DetailItem label='状态'>{status ? status.valueDesc : null}</DetailItem>
					<DetailItem label='业务负责人'>
						{
							orderDetail.employeeDtoList ?
								orderDetail.employeeDtoList.map(item => <p>{`${item.employeeName}-${item.positionName}`}</p>)
								: null
						}
					</DetailItem>
					<DetailItem label='所属组织'>
						{
							orderDetail.boOrgDtoList ?
								orderDetail.boOrgDtoList.map(item => <p>{item.deptName}</p>)
								: null
						}
					</DetailItem>
				</Row>
				<div className='divider' />
				<div className='distributorTitle'>{orderDetail.orderName}的商品</div>
				<Table
					scroll={{ y: 500 }}
					rowKey='productCode'
					loading={this.state.tableLoading}
					columns={columns}
					dataSource={this.state.productData}
				/>
			</div>
		)
	}
}

export default OrderDetail
