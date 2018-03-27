import React, { Component } from 'react'
import { Card, message } from 'antd'
import { AgentHOC } from 'components/connect'
import Form from '../Form'

class CreateAgent extends Component {
	state = {
		btnLoading: false
	}

	render() {
		const formProps = {
			agentStatus: this.props.agentStatus,
			agentTier: this.props.agentTier,
			bank: this.props.bank,
			agentCategory: this.props.agentCategory,
			formData: {},
			btnLoading: this.state.btnLoading,
			onSave: (datas) => {
				this.setState({ btnLoading: true })
				request.send(HTTP_CMD.AGENT_CREATE, datas).then(() => {
					this.setState({ btnLoading: false })
					message.success('代理人创建成功')

					const { history } = this.props
					history.push('/app/agent-manage/audited')
				}).catch(() => {
					this.setState({ btnLoading: false })
					message.error('代理人创建失败')
				})
			}
		}

		return (
			<Card title='新建代理商'>
				<Form {...formProps} />
			</Card>
		)
	}
}

export default AgentHOC(CreateAgent)
