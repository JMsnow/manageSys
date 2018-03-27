import React, { Component } from 'react'
import { Card, message } from 'antd'
import { AgentHOC } from 'components/connect'
import Form from '../Form'

class EditAgent extends Component {
	state = {
		formData: {},
		btnLoading: false
	}

	componentWillMount() {
		const { agentId } = this.props.match.params
		request.send(HTTP_CMD.AGENT_DETAIL, { agentId }).then((res) => {
			this.setState({ formData: res.data })
		})
	}

	render() {
		const { formData, btnLoading } = this.state

		const formProps = {
			agentStatus: this.props.agentStatus,
			agentTier: this.props.agentTier,
			bank: this.props.bank,
			agentCategory: this.props.agentCategory,
			formData,
			btnLoading,
			onSave: (datas) => {
				this.setState({ btnLoading: true })
				request.send(HTTP_CMD.AGENT_MODIFY, {
					...datas,
					agentId: formData.agentId
				}).then(() => {
					this.setState({ btnLoading: false })
					message.success('代理人修改成功')
					const { history } = this.props
					history.push('/app/agent-manage/audited')
				}).catch(() => {
					message.error('代理人修改失败')
					this.setState({ btnLoading: false })
				})
			}
		}

		return (
			<Card title='编辑代理人'>
				<Form {...formProps} />
			</Card>
		)
	}
}

export default AgentHOC(EditAgent)
