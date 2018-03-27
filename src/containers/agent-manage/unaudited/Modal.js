import React, { Component } from 'react'
import { Modal, Row, Col, Button, Input, Select, Spin, message } from 'antd'
import moment from 'moment'

const TextArea = Input.TextArea
const Option = Select.Option

class AgentModal extends Component {
	state = {
		agentList: [],
		fetching: false,
		keywords: '',
		confirmLoading: false,
		agent: {},
		agentPrograms: [],
		fAgentId: null,
		approvalFeedback: ''
	}

	componentWillMount() {
		const { agentId } = this.props
		request.send(HTTP_CMD.AGENT_DETAIL, { agentId }).then((res) => {
			this.setState({
				agent: res.data,
				fAgentId: res.data.parent.agentId
			})

			this._loadAgentList()
		})

		this._loadAgentPrograms()
	}

	getFAgentCategory = () => {
		const {
			agent: {
				agentCategory,
				parent
			}
		} = this.state

		if (!parent || isNaN(agentCategory)) return ''

		const { agentCategories } = this.props
		const category = agentCategories.find(_ => _.columnValue === agentCategory)

		return category ? category.valueDesc : ''
	}

	getFagentTier = () => {
		const {
			agent: { parent }
		} = this.state

		if (!parent) return ''

		const { agentTier } = parent

		return `${['顶', '一', '二'][agentTier]}级代理`
	}

	_loadAgentPrograms = () => {
		const params = {
			current: 1,
			size: 100,
			condition: {
				textQuery: ''
			}
		}

		request.send(HTTP_CMD.DISTRIBUTION_SYS_LIST, params).then((res) => {
			this.setState({
				agentPrograms: res.data.records
			})
		})
	}

	_loadAgentList = () => {
		const { agentId } = this.props
		const { keywords, agent: { parent = {} } } = this.state
		this.setState({ fetching: true })

		request.send(HTTP_CMD.AGENT_LIST, {
			current: 1,
			size: 10,
			condition: {
				keywords
			}
		}).then((res) => {
			const agentList = res.data.records.filter(_ => _.agentId !== agentId)
			const index = agentList.findIndex(_ => _.agentId !== parent.agentId)

			if (index === -1) {
				agentList.concat([parent])
			}

			this.setState({
				agentList,
				fetching: false
			})
		}).catch(() => {
			this.setState({
				agentList: [],
				fetching: false
			})
		})
	}

	handleSearchAgent = (val) => {
		this.setState({
			keywords: val
		}, () => {
			this._loadAgentList()
		})
	}

	handleChangeInput = (e) => {
		this.setState({
			approvalFeedback: e.target.value
		})
	}

	handleAgree = () => {
		const { handleAgree } = this.props
		const {
			agent: { agentName }
		} = this.state

		const callback = () => {
			message.success(`${agentName}的代理人申请已通过`)

			if (typeof handleAgree === 'function') handleAgree()
		}

		this.handleAuditCheck(0, callback)
	}

	handleDecline = () => {
		const { handleDecline } = this.props
		const {
			agent: { contactName }
		} = this.state

		const callback = () => {
			message.error(`${contactName}的代理人申请已拒绝`)

			if (typeof handleDecline === 'function') handleDecline()
		}

		this.handleAuditCheck(3, callback)
	}

	handleAuditCheck = (agentStatus, callback) => {
		const {
			fAgentId,
			approvalFeedback
		} = this.state

		const {
			agentId
		} = this.props

		const datas = {
			agentId,
			fAgentId,
			approvalFeedback,
			agentStatus
		}

		request.send(HTTP_CMD.AGENT_CHECK, {
			...datas,
			agentStatus
		}).then(() => {
			callback()
		})
	}

	handleFAgentIdChange = (val) => {
		this.setState({
			fAgentId: val
		})
	}

	render() {
		const {
			agent,
			fetching,
			agentList,
			fAgentId,
			agentPrograms
		} = this.state

		const {
			agentStatuses,
			handleCancel
		} = this.props

		const {
			agentProgramId,
			agentStatus
		} = agent

		let agentProgramName = ''

		if (agentProgramId) {
			const program = agentPrograms.find(_ => _.agentProgramId === agentProgramId)
			agentProgramName = program ? program.agentProgramName : ''
		}

		let agentStatusDesc = ''

		if (!isNaN(agentStatus)) {
			const item = agentStatuses.find(_ => _.columnValue === +agentStatus)

			if (item) agentStatusDesc = item.valueDesc
		}

		const modalProps = {
			title: '查看待审核代理人详情',
			visible: true,
			onCancel: handleCancel,
			footer: (
				<span>
					<Button onClick={() => handleCancel()}>关闭</Button>
					<Button type='danger' onClick={() => this.handleDecline()}>拒绝</Button>
					<Button type='primary' onClick={() => this.handleAgree()}>同意</Button>
				</span>
			)
		}

		const fAgentIdSelectProps = {
			value: fAgentId,
			style: { width: '100%' },
			showSearch: true,
			allowClear: true,
			placeholder: '请选择上级代理人',
			filterOption: false,
			onChange: this.handleFAgentIdChange,
			onSearch: utils.debounce(this.handleSearchAgent, 400),
			notFoundContent: fetching ? <Spin size='small' /> : null,
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		return (
			<Modal {...modalProps}>
				<Row style={{ lineHeight: 3 }}>
					<Col span={12}>姓名: {agent.contactName}</Col>
					<Col span={12}>手机号码: {agent.mobile}</Col>
					<Col span={12}>身份证号: {agent.idCode}</Col>
					<Col span={12}>微信号: {agent.wechatCode}</Col>
					<Col span={12}>申请时间: {agent.createDt ? moment(agent.createDt).format('YYYY-MM-DD HH:mm:ss') : ''}</Col>
					<Col span={12}>申请体系: {agentProgramName}</Col>
					<Col span={12}>推荐人: {agent.parent ? agent.parent.contactName : ''}</Col>
					<Col span={12}>推荐人类型: {this.getFAgentCategory()}</Col>
					<Col span={12}>推荐人等级: {this.getFagentTier()}</Col>
					<Col span={12}>状态: {agentStatusDesc}</Col>
					<Col span={24}>申请备注: {agent.applyNotes}</Col>
					<Col span={24}>
						<span style={{ float: 'left' }}>审批意见: </span>
						<div style={{ margin: '10px 0 10px 70px' }}><TextArea rows={4} onChange={this.handleChangeInput} /></div>
					</Col>
					<Col span={24}>
						<span style={{ float: 'left' }}>指定上级代理人: </span>
						<div style={{ margin: '0 0 10px 110px' }}>
							<Select {...fAgentIdSelectProps}>
								{ agentList.map(agentItem => <Option value={agentItem.agentId}>{agentItem.contactName}({agentItem.mobile})</Option>)}
							</Select>
						</div>
					</Col>
				</Row>
			</Modal>
		)
	}
}

export default AgentModal
