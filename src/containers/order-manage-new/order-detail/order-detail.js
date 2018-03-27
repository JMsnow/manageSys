import React from 'react'
import { Table, Tag, Row, Col, Button } from 'antd'
import moment from 'moment'
import renderReactNode from 'utils/render-react-node'
import style from './style.scss'
import AlterVisitorModal from './alter-visitor-modal'

// "licenceType":"",//证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他
const licenceTypeMap = {
	'0': '身份证',
	'1': '护照',
	'2': '军官证',
	'3': '回乡证',
	'4': '台胞证',
	'5': '国际海员证',
	'6': '港澳通行证',
	'7': '赴台证',
	'8': '其他'
}
// 票类型0:单票 1:套票
const ticketTypeMap = {
	'0': '单票',
	'1': '套票'
}
//票价类型 0:成人票 1:儿童票
const typeMap = {
	'0': '成人票',
	'1': '儿童票'
}
function format(
	{
		date,
		dateFmt,
		fmt = 'YYYY-MM-DD'
	}
) {
	return date ? moment(date, dateFmt).format(fmt) : ''
}
export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	showAlterVisitorModal = (record) => {
		renderReactNode({
			getContent: ({ destroy }) => {
				const opts = {
					destroy,
					record,
					onSuccess: (values) => {
						destroy()
						this.props.onUpdateVisitorData(values)
					}
				}
				return <AlterVisitorModal {...opts} />
			}
		})
	}
	getVisitorTable() {
		const columns = [
			{
				title: '票价类目',
				dataIndex: '',
				width: '10%'
			},
			{
				title: '票种',
				dataIndex: 'ticketType',
				width: '12.5%',
				render: (text ,record)=> (
				<React.Fragment>
					<p>{ticketTypeMap[record.ticketType]}</p>
					<Tag color="red">{typeMap[record.type]}</Tag>
				</React.Fragment>
				)
			},
			{
				title: '游客姓名',
				dataIndex: 'name',
				width: '10%'
			},
			{
				title: '游客电话',
				dataIndex: 'phone',
				width: '10%'
			},
			{
				title: '证件类型',
				dataIndex: 'licenceType',
				width: '15%',
				render: text => licenceTypeMap[text]
			},
			{
				title: '证件号',
				dataIndex: 'lincese',
				width: '12.5%'
			},
			{
				title: '接送信息',
				dataIndex: '接送信息',
				width: '15%'
			},
			{
				title: '票价',
				dataIndex: '票价',
				width: '10%',
				className: 'text-red'
			},
			{
				title: '操作',
				dataIndex: 'orderId',
				width: '5%',
				render: (text, record) => <Button type="primary" onClick={() => {this.showAlterVisitorModal(record)}}>编辑</Button>
			}
		]
		return (
			<Table
				scroll={{ y: 500 }}
				rowKey='key'
				loading={this.props.loading}
				columns={columns}
				dataSource={this.props.visitorData}
			/>
		)
	}
	render() {
		const { orderExtend = {}, orderItems = {}, ...rest } = this.props.orderInfo
		return (
			<div className={style.detail}>
				<div className={style.main_title}>{orderItems.productName}</div>
				<div className={style.info_wrap}>
					<Row className={style.title} type="flex" justify="space-between">
						<Col>当前状态：已全款</Col>
						<Col>订单号：{rest.orderNo}</Col>
					</Row>
					<div className={style.cont}>
						<table className={style.table_custom}>
							<tbody>
							<tr>
								<th>产品编号</th>
								<td>{orderItems.productCode}</td>
								<th>行程时间</th>
								<td>2天</td>
							</tr>
							<tr>
								<th>报名时间</th>
								<td>2018-01-26 22:10:26</td>
								<th>确认时间</th>
								<td> </td>
							</tr>
							<tr>
								<th>出团日期</th>
								<td>{format({ date: orderExtend.startDate})}</td>
								<th>回团日期</th>
								<td>{format({ date: orderExtend.endDate})}</td>
							</tr>
							<tr>
								<th>团号</th>
								<td>{orderExtend.groupOrderNo}</td>
								<th>订单备注</th>
								<td>{rest.remark}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className={style.info_wrap}>
					<Row className={style.title} type="flex" justify="space-between">
						<Col>联系信息</Col>
					</Row>
					<div className={style.cont}>
						<table className={style.table_custom}>
							<tbody>
							<tr>
								<th>卖家名称</th>
								<td>{orderExtend.saler_name}</td>
								<th>买家名称</th>
								<td>{rest.userName}</td>
							</tr>
							<tr>
								<th>联系客服</th>
								<td>{orderExtend.servicer}（手机：{orderExtend.servicerPhone}）</td>
								<th>联系手机号</th>
								<td>{orderExtend.servicerPhone}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className={style.info_wrap}>
					<Row className={style.title} type="flex" justify="space-between">
						<Col>游客信息 [联系人：许]  [联系电话：15312312323] 6大/ 0小</Col>
					</Row>
					<div className={`${style.cont} ${style.table_wrap}`}>
						{this.getVisitorTable()}
					</div>
				</div>
				<div className={style.info_wrap}>
					<Row className={style.title} type="flex" justify="space-between">
						<Col>价格明细</Col>
					</Row>
					<div className={style.cont}>
						<table className={style.table_custom}>
							<tbody>
							<tr>
								<th>票价总额</th>
								<td>￥{rest.totalAmount}</td>
								<th>首款金额</th>
								<td>￥{rest.ofirstPay}元</td>
							</tr>
							<tr>
								<th>接送总额</th>
								<td>￥0.01</td>
								<th>尾款金额</th>
								<td>￥0.00元</td>
							</tr>
							<tr>
								<th>门市价总额</th>
								<td className={style.text_red}>￥{rest.omarketPrice}</td>
								<th>已支付金额</th>
								<td>￥{rest.actualAmount}</td>
							</tr>
							<tr>
								<th>结算价总额</th>
								<td colSpan={3} className={style.text_red}>￥{rest.realAmount}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}
