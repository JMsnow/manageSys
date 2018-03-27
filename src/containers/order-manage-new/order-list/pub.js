import React from 'react'
import { Select, DatePicker, Input } from 'antd'
import moment from 'moment'
import RemoteSelect from 'components/remote-select'

import style from './style.scss'

const ORDER_ALTER_KEY = {
	cancelOrder: '1',
	alertVisitor: '2',
	completeFollowing: '3'
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
function createRemoteSelect(
	{
		isSearch = false,
		getData = () => (
			[
				{
					value: '',
					text: '全部'
				}
			]
		)
	} = {}
	) {
	const remoteOpts = {
		isSearch: isSearch,
		getData
	}
	const selectProps = {
		filterOption: !isSearch,
		placeholder: '请选择',
		getPopupContainer: triggerNode => triggerNode.parentNode
	}
	return (<RemoteSelect {...selectProps} remoteOpts={remoteOpts}/>)
}

function createSelect({list = [], placeholder = '请选择', allOption = <Select.Option value="">全部</Select.Option> }) {
	return (
		<Select placeholder="请选择">
			{ allOption }
			{
				list.map(({ value, text}, i) => <Select.Option value={value} key={i.toString()}>{text}</Select.Option>)
			}
		</Select>
	)
}
const fieldDecoratorMap = {
	buyerChannel: {
		label: '买家渠道',
		id: 'source',
		options: {
			initialValue: ''
		},
		input: createSelect({
			list: [
				{
					value: '1',
					text: '订单中心下单'
				},
				{
					value: '2',
					text: 'b2b下单'
				}
			]
		})
	},
	orderStatus: {
		label: '订单状态',
		id: 'orderStatus',
		options: {
			initialValue: ''
		},
		input: createSelect({
			list: [
				{
					value: '10',
					text: '已支付'
				},
				{
					value: '11',
					text: '配送中'
				},
				{
					value: '12',
					text: '已配送'
				},
				{
					value: '20',
					text: '已返佣'
				},
				{
					value: '30',
					text: '已完成'
				},
				{
					value: '40',
					text: '退货中'
				},
				{
					value: '41',
					text: '已退货'
				}
			]
		})
	},
	paymentType: {
		label: '付款方式',
		id: 'payChannel',
		options: {
			initialValue: ''
		},
		input: createSelect({
			list: [
				{
					value: '10',
					text: '微信支付'
				},
				{
					value: '20',
					text: '支付宝支付'
				}
			]
		})
	},
	orderType: {
		label: '订单类型',
		id: 'type',
		options: {
			initialValue: ''
		},
		input: createSelect({
			list: [
				{
					value: '1',
					text: '个人'
				},
				{
					value: '2',
					text: '企业'
				}
			]
		})
	},
	product: {
		label: '产品名称',
		id: 'productName',
		options: {
			initialValue: ''
		},
		input: createRemoteSelect(
			{
				async getData() {
					const { data } = await request.send('/product/orderProductListForPC', {})
					return (data || []).map(v => ({ value: v.productName, text: v.productName}))
				}
			}
		)
	},
	sortType: {
		label: '排序方式',
		id: '排序方式',
		options: {
			initialValue: ''
		},
		input: createSelect({
			list: []
		})
	},
	goGroupDate: {
		label: '发团日期',
		id: 'beginDate',
		options: {
			initialValue: []
		},
		input: (<DatePicker.RangePicker />)
	},
	backGroupDate: {
		label: '回团日期',
		id: 'endDate',
		options: {
			initialValue: []
		},
		input: (<DatePicker.RangePicker />)
	},
	orderDate: {
		label: '下单日期',
		id: 'orderTime',
		options: {
			initialValue: []
		},
		input: (<DatePicker.RangePicker />)
	},
	visitorName: {
		label: '游客姓名',
		id: 'guideName',
		options: {
			initialValue: ''
		},
		input: (<Input placeholder="游客姓名"/>)
	},
	visitorPhone: {
		label: '游客电话',
		id: 'guidePhone',
		options: {
			initialValue: ''
		},
		input: (<Input placeholder="游客电话"/>)
	},
	orderPerson: {
		label: '下单人',
		id: 'userName',
		options: {
			initialValue: ''
		},
		input: (<Input placeholder="下单人"/>)
	},
	orderNo: {
		label: '订单号',
		id: 'orderNo',
		options: {
			initialValue: ''
		},
		input: (<Input placeholder="订单号"/>)
	},
	groupNo: {
		label: '团号',
		id: 'groupOrderNo',
		options: {
			initialValue: ''
		},
		input: (<Input placeholder="团号"/>)
	}
}

// 订单类型 1个人 2企业
const typeMap = {
	'1': '个',
	'2': '企'
}
// 是否全款0未全款 1全款
const payTypeMap = {
	'0': <span className={`${style.notice_title} ${style.orange}`}>未全款</span>,
	'1': <span className={`${style.notice_title} ${style.green}`}>已全款</span>
}
const columnMap = {
	productInfo: {
		title: '产品信息',
		dataIndex: '产品信息',
		render(text, record, index) {
			return (
				<React.Fragment>
					<div className={`clearfix ${style.expand_head} ${style.info}`}>
						<span className={`lf ${style.type_tip}`}>{typeMap[record.type]}</span>
						<span className={'lf'}>订单号:{record.orderNo}</span>
						<span className={'lf'}>团号:{record.groupOrderNo}</span>
						<span className={'rt'}>预定时间:{format({ date: record.orderTime, fmt: 'YYYY-MM-DD HH:mm:ss'})}</span>
					</div>
					<div className={style.expand_body}>
						<div title={record.productName} className={`${style.cell_in} ${style.text_hidden}`}>【{record.productCode}】{record.productName}</div>
						<div className={style.cell_in}>
							<span className={style.w30}>出团:{format({ date: record.startDate})}</span>
							<span className={style.w30}>回团:{format({ date: record.endDate})}</span>
						</div>
						<div className={`${style.cell_in} ${style.no_border}`}>
							<span className={style.w30}>出发城市:{record.place}</span>
							<span className={style.w30}>天数:{record.pDays}</span>
						</div>
					</div>
				</React.Fragment>
			)
		}
	},
	buyerSale: {
		title: '买家卖家信息',
		dataIndex: '买家卖家信息',
		render(text, record, index) {
			return (
				<React.Fragment>
					<div className={style.expand_head} />
					<div className={style.person_info}>
						<div className={`${style.cell_in} ${style.no_border}`}>
							<span className={style.buy_text}>买:</span>
							{record.userName}&nbsp;&nbsp;{record.phone}
							<span className={style.company_text}>【{record.orgName}】</span>
						</div>
						<div className={`${style.cell_in} ${style.no_border}`}>
							<span className={style.sale_text}>卖:</span>
							{record.salerName}&nbsp;&nbsp;{record.salerPhone}
							<span className={style.company_text}>【{record.salerCompanyName}】</span>
						</div>
						<div className={`${style.cell_in} ${style.no_border}`} />
					</div>
				</React.Fragment>
			)
		}
	},
	orderStatus: {
		title: '订单状态',
		dataIndex: '订单状态',
		render(text, record, index) {
			return (
				<React.Fragment>
					<div className={style.expand_head}>
						<span>支付时间:{format({ date: record.payDate, fmt: 'YYYY-MM-DD HH:mm:ss'})}</span>
					</div>
					<div className={style.expand_body}>
						<div className={style.cell_in}>
							人数:{record.peopleNum}
						</div>
						<div className={style.cell_in}>
							销售:￥{record.totalAmout}
							{payTypeMap[record.payType]}
						</div>
						<div className={`${style.cell_in} ${style.no_border}`}>
							结算:￥{record.actualAmount}
						</div>
					</div>
				</React.Fragment>
			)
		}
	},
	serviceDemand: {
		title: '服务诉求',
		dataIndex: '服务诉求',
		render(text, record, index) {
			return text
		}
	}
}

export {
	ORDER_ALTER_KEY,
	fieldDecoratorMap,
	columnMap
}
