import React, { Component } from 'react'
import { Modal, Form, message, List, Divider, Steps } from 'antd'
import moment from 'moment'
import style from './style.scss'

function format(
	{
		date,
		dateFmt,
		fmt = 'YYYY-MM-DD'
	}
) {
	return date ? moment(date, dateFmt).format(fmt) : ''
}

class modal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			logsData: []
		}
	}
	componentWillMount() {
		this.init()
	}
	getStepsFinish = (current = 0) => {
		return (
			<Steps progressDot current={current}>
				<Steps.Step title="创建订单" />
				<Steps.Step title="完成首付款" />
				<Steps.Step title="完成全款" />
			</Steps>
		)
	}
	getStepsCancel = (current = 0) => {
		return (
			<Steps progressDot current={current}>
				<Steps.Step title="创建订单" />
				<Steps.Step title="取消订单" />
			</Steps>
		)
	}
	getSteps = () => {
		const { status = null } = this.state.logsData[this.state.logsData.length -1] || {}
		// 1新增2处理完成3取消
		if (status !== null) {
			if (status === 1) {
				return this.getStepsFinish(0)
			} else if (status === 2) {
				return this.getStepsFinish(2)
			} else if (status === 3) {
				return this.getStepsCancel(1)
			}
		}

		return this.getStepsFinish()
	}
	queryData = async () => {
		try {
			this.setState({ loading: true })
			const { data } = await request.send('/order-service/order/queryOrderLogs', {
				orderNo: this.props.id
			})
			if (data) {
				this.setState({
					logsData: []
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
		const modalProps = {
			title: '系统日志',
			visible: true,
			width: 1000,
			onCancel: this.props.destroy,
			footer: null
		}
		const space = '&nbsp;&nbsp;&nbsp;&nbsp;'

		return (
			<Modal {...modalProps}>
				{this.getSteps()}
				<Divider dashed />
				<List
					dataSource={this.state.logsData}
					renderItem={item => (
						<List.Item>
							{format({ date: item.updateTime, fmt: 'YYYY-MM-DD HH:mm:ss'})}
							{space}
							{item.operateDetail}
							{space}
							{item.createUser}
							({item.companyName})
						</List.Item>
					)}
				/>
			</Modal>
		)
	}
}

export default Form.create()(modal)
