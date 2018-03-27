import React from 'react'
import { Table, message, Row, Col, Button } from 'antd'
import renderReactNode from 'utils/render-react-node'

import style from './style.scss'
import AuditPayRecordModal from './audit-pay-record-modal'
import CreatePayRecordModal from './create-pay-record-modal'

const typeMap = {
	'0': '全款',
	'1': '首款',
	'2': '尾款'
}
const fStatusMap = {
	'0': '待确认',
	'1': '无效',
	'2': '已确认'
}
export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			payData: [{ key: 1, id: 1 }]
		}
	}
	componentWillMount() {
		this.init()
	}
	showAuditPayRecordModal = (record) => {
		renderReactNode({
			getContent: ({ destroy }) => {
				const opts = {
					destroy,
					orderInfo: this.props.orderInfo,
					record,
					onSuccess: () => {
						destroy()
						this.queryData()
					}
				}
				return <AuditPayRecordModal {...opts} />
			}
		})
	}
	showCreatePayRecordModal = () => {
		renderReactNode({
			getContent: ({ destroy }) => {
				const opts = {
					destroy,
					id: this.props.id,
					orderInfo: this.props.orderInfo,
					onSuccess: () => {
						destroy()
						this.queryData()
					}
				}
				return <CreatePayRecordModal {...opts} />
			}
		})
	}
	getPayTable() {
		const columns = [
			{
				title: '操作说明',
				dataIndex: 'transNo',
				width: '10%'
			},
			{
				title: '操作人',
				dataIndex: 'createUser',
				width: '10%'
			},
			{
				title: '支付单号',
				dataIndex: 'payId',
				width: '15%'
			},
			{
				title: '支付金额',
				dataIndex: 'money',
				width: '10%',
				className: 'text-red'
			},
			{
				title: '支付方式',
				dataIndex: 'fStatus',
				width: '10%',
				render: (text) => `线下支付（${fStatusMap[text]}）`
			},
			{
				title: '支付状态',
				dataIndex: 'type',
				width: '10%',
				render: (text) => `已${typeMap[text]}`
			},
			{
				title: '操作时间',
				dataIndex: 'updateTime',
				width: '15%'
			},
			{
				title: '备注',
				dataIndex: 'uploadDesc',
				width: '10%',
				className: 'text-red'
			},
			{
				title: '查看凭证',
				dataIndex: 'id',
				width: '10%',
				render: (text, record) => (<Button type="primary" onClick={() => {this.showAuditPayRecordModal(record)}}>点击查看</Button>)
			}
		]
		return (
			<Table
				scroll={{ y: 500 }}
				rowKey='key'
				loading={this.state.loading}
				columns={columns}
				dataSource={this.state.payData}
			/>
		)
	}
	queryData = async () => {
		try {
			this.setState({ loading: true })
			const { data } = await request.send('/orderOffLine/acceptOrderOffLineList', {
				order: this.props.id
			})
			if (data) {
				this.setState({
					payData: (data || []).map(v => ({...v, key: v.id}))
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
		const { productName } = this.props.orderInfo.orderItems || {}
		return (
			<div className={style.pay}>
				<div className={style.main_title}>{productName}</div>
				<div className={style.info_wrap}>
					<Row className={style.title} type="flex" justify="space-between">
						<Col>支付明细</Col>
					</Row>
					<div className={`${style.cont} ${style.table_wrap}`}>
						{this.getPayTable()}
					</div>
				</div>
				<Row type="flex" justify="end">
					<Col><Button type="danger" onClick={this.showCreatePayRecordModal}>创建凭证</Button></Col>
				</Row>
			</div>
		)
	}
}
