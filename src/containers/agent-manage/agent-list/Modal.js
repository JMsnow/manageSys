import React, { Component } from 'react'
import { Modal, Select, Spin, Form, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class modal extends Component {
	state = {
		agentList: [],
		fetching: false,
		keywords: '',
		agentProgramName: '',
		btnLoading: false
	}

	componentDidMount() {
		this._loadAgentList()
	}

	_loadAgentList = () => {
		const { keywords } = this.state
		this.setState({ fetching: true })

		request.send(HTTP_CMD.AGENT_LIST, {
			current: 1,
			size: 10,
			condition: {
				keywords
			}
		}).then((res) => {
			this.setState({
				agentList: res.data.records,
				fetching: false
			})
		}).catch(() => {
			this.setState({
				agentList: [],
				fetching: false
			})
		})
	}

	handleFAgentIdChange = (val) => {
		const {
			agentList
		} = this.state

		const agent = agentList.find(_ => _.agentId === +val)

		if (agent) {
			const {
				form: { setFieldsValue }
			} = this.props

			const { agentProgramId } = agent

			request.send(HTTP_CMD.DISTRIBUTION_SYS_DETAIL, {
				agentProgramId
			}).then((res) => {
				this.setState({ agentProgramName: res.data.agentProgramName })
			})

			setFieldsValue({ agentProgramId })
		}
	}

	handleSearchAgent = (val) => {
		this.setState({
			keywords: val
		}, () => {
			this._loadAgentList()
		})
	}

	handleSubmit = () => {
		const {
			form: {
				validateFields,
				getFieldsValue
			},
			agentIdList,
			onSuccess
		} = this.props

		validateFields((errors) => {
			if (errors) return

			helper.confirm('您确定要批量修改上级代理人吗？确认后将覆盖原代理体系！').then(() => {
				this.setState({ btnLoading: true })

				const datas = {
					...getFieldsValue(),
					agentIdList
				}

				request.send(HTTP_CMD.AGENT_BATCH_UPDATE, datas).then(() => {
					message.success('批量修改代理人成功')
					this.setState({ btnLoading: false })

					if (typeof onSuccess === 'function') {
						onSuccess()
					}
				}).catch(() => {
					message.error('批量修改代理人失败')
					this.setState({ btnLoading: false })
				})
			})
		})
	}

	render() {
		const {
			agentList,
			fetching,
			agentProgramName,
			btnLoading
		} = this.state

		const modalProps = {
			title: '批量修改',
			visible: true,
			confirmLoading: btnLoading,
			onOk: this.handleSubmit,
			onCancel: this.props.onCancle
		}

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 12
			},
			colon: false
		}

		const fAgentIdSelectProps = {
			showSearch: true,
			placeholder: '请选择上级代理人',
			filterOption: false,
			onSearch: utils.debounce(this.handleSearchAgent, 400),
			onChange: this.handleFAgentIdChange,
			notFoundContent: fetching ? <Spin size='small' /> : null,
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		const {
			form: { getFieldDecorator }
		} = this.props

		return (
			<Modal {...modalProps}>
				<Form>
					<FormItem {...formItemLayout} label='上级代理人'>
						{
							getFieldDecorator('fAgentId', {
								rules: [
									{ required: true, message: '请选择上级代理人' }
								]
							})(
								<Select {...fAgentIdSelectProps}>
									{ agentList.map(agent => <Option value={agent.agentId}>{agent.contactName}({agent.mobile})</Option>)}
								</Select>
							)
						}
					</FormItem>
					<FormItem {...formItemLayout} label='所属体系'>
						{
							getFieldDecorator('agentProgramId', {
								rules: [
									{ required: true, message: '请选择所属体系' }
								]
							})(
								<div style={{ lineHeight: '31px', height: '31px', padding: '0 12px', background: '#ddd' }}>
									{agentProgramName}
								</div>
							)
						}
					</FormItem>
				</Form>
			</Modal>
		)
	}
}

export default Form.create()(modal)
