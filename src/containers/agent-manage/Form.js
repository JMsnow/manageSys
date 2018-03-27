import React, { Component } from 'react'
import { Form, Input, Select, Button, Row, Col, TreeSelect, Spin } from 'antd'
import { isArray } from 'lodash'

const FormItem = Form.Item
const TextArea = Input.TextArea
const TreeNode = TreeSelect.TreeNode
const Option = Select.Option
const OptGroup = Select.OptGroup

class AgentForm extends Component {
	constructor(props) {
		super(props)
		this.lastFetchId = 0
	}

	state = {
		deptTreeData: [],
		selectedPrincipal: [],
		agentPrograms: [],
		staffList: [],
		showEmployee: true,
		showAgentLevel: true,
		agentList: [],
		agentProgramSearchId: null,
		agentKeywords: '',
		fetching: false,
		hasFAgent: false,
		needBankAcct: false
	}

	componentDidMount() {
		this._loadDepartTree()
		this._loadPrincipalData()
		this._loadAgentPrograms()
		this._loadStaffsData()
		this._loadAgentList()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formData.agentCategory !== this.props.formData.agentCategory) {
			const type = nextProps.formData.agentCategory

			if (!isNaN(type)) this.handleAgentTypeChange(type)
		}

		if (nextProps.formData.agentProgramId !== this.props.formData.agentProgramId) {
			this.handleAgentProgramIdChanged(nextProps.formData.agentProgramId)
		}

		if (nextProps.formData.parent) this.setState({ hasFAgent: true })
	}

	handleAgentTypeChange = (type) => {
		const isAgent = type === 0

		this.setState({
			showEmployee: !isAgent,
			showAgentLevel: isAgent
		})
	}

	handleSearch = (value) => {
		request.send(HTTP_CMD.USER_CREATE_SELETC_STAFF, { employeeName: value }).then((res) => {
			this.setState({ staffList: res.data })
		})
	}

	handleSearchAgent = (value) => {
		this.setState({
			agentKeywords: value
		}, () => {
			this._loadAgentList()
		})
	}

	handleAgentProgramIdChanged = (agentProgramId) => {
		this.setState({
			agentProgramSearchId: agentProgramId,
			keywords: ''
		}, () => {
			this._loadAgentList()
		})
	}

	handleSave = () => {
		const {
			form: {
				validateFields,
				getFieldsValue
			},
			onSave
		} = this.props

		validateFields((errors) => {
			if (errors) return
			const datas = getFieldsValue()

			const { agentCategory, positionIdSet } = datas

			if (!isArray(positionIdSet)) {
				datas.positionIdSet = [positionIdSet]
			}

			if (agentCategory !== 0) {
				datas.agentTier = 0
			}

			onSave(datas)
		})
	}

	handleFAgentIdChange = (val) => {
		const {
			form: { setFieldsValue }
		} = this.props

		if (val) {
			this.setState({ hasFAgent: true })

			request.send(HTTP_CMD.AGENT_DETAIL, { agentId: val }).then((res) => {
				const {
					positionIdSet,
					deptIdSet
				} = res.data

				setFieldsValue({
					positionIdSet,
					deptIdSet
				})
			})
		} else {
			this.setState({ hasFAgent: false })

			setFieldsValue({
				positionIdSet: [],
				deptIdSet: []
			})
		}
	}

	handleAsscBankChange = (val) => {
		this.setState({
			needBankAcct: !!val
		}, () => {
			this.props.form.validateFields(['asscBankAcct'], { force: true })
		})
	}

	_loadDepartTree = () => { // 获取部门下拉列表数据
		request.send(HTTP_CMD.DEPT_LIST_ALL_ORG).then((res) => {
			this.setState({
				deptTreeData: helper.generateJsonTree(res.data)
			})
		})
	}

	_loadPrincipalData = (value) => { // 获取负责人下拉列表数据
		request.send(HTTP_CMD.SELECT_PRINCIPAL, { keywords: value }).then((res) => {
			this.setState({ selectedPrincipal: res.data })
		})
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

	_loadStaffsData = () => {
		request.send(HTTP_CMD.USER_CREATE_SELETC_STAFF, { employeeName: '' }).then((res) => {
			this.setState({ staffList: res.data })
		})
	}

	_loadAgentList = () => {
		this.setState({ fetching: true })
		const {
			agentProgramSearchId,
			agentKeywords
		} = this.state

		this.lastFetchId += 1
		const fetchId = this.lastFetchId

		request.send(HTTP_CMD.AGENT_LIST, {
			current: 1,
			size: 10,
			condition: {
				agentProgramId: agentProgramSearchId,
				keywords: agentKeywords
			}
		}).then((res) => {
			if (fetchId !== this.lastFetchId) return

			this.setState({
				agentList: res.data.records,
				fetching: false
			})
		}).catch(() => {
			this.setState({
				agentList: [],
				fetch: false
			})
		})
	}

	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.deptName} value={item.deptId} key={item.deptId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} value={item.deptId} key={item.deptId} />
	})

	render() {
		const {
			form: { getFieldDecorator },
			formData = {},
			agentStatus: { agentStatuses },
			agentTier: { agentTiers },
			bank: { banks },
			agentCategory: { agentCategories },
			btnLoading
		} = this.props

		const {
			deptTreeData,
			selectedPrincipal,
			agentPrograms,
			showEmployee,
			showAgentLevel,
			staffList,
			fetching,
			hasFAgent,
			needBankAcct
		} = this.state

		let {
			agentList
		} = this.state

		const {
			agentId
		} = formData

		if (agentId) {
			agentList = agentList.filter(_ => _.agentId !== agentId)
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

		const deptTreeSelectProps = {
			dropdownMatchSelectWidth: true,
			multiple: true,
			showSearch: true,
			placeholder: '输入组织名过滤搜索',
			treeNodeFilterProp: 'title',
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		const principleSelectProps = {
			showSearch: true,
			optionFilterProp: 'children',
			// mode: 'multiple',
			placeholder: '输入业务负责人过滤搜索',
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		const employeeSelectProps = {
			allowClear: true,
			showSearch: true,
			placeholder: '输入员工名过滤搜索',
			filterOption: false,
			onSearch: utils.debounce(this.handleSearch, 400),
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		const superiorSelectProps = {
			showSearch: true,
			allowClear: true,
			placeholder: '输入代理人名称过滤搜索',
			filterOption: false,
			onSearch: utils.debounce(this.handleSearchAgent, 400),
			onChange: this.handleFAgentIdChange,
			notFoundContent: fetching ? <Spin size='small' /> : null,
			getPopupContainer: triggerNode => triggerNode.parentNode
		}

		return (
			<Form>
				<Row type='flex' justify='center'>
					<Col span={22}>
						<FormItem {...formItemLayout} label='代理人名称'>
							{
								getFieldDecorator('contactName', {
									validateTrigger: 'onBlur',
									initialValue: formData.contactName,
									rules: [
										{ required: true, message: '请填写代理人名称' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='手机号码'>
							{
								getFieldDecorator('mobile', {
									validateTrigger: 'onBlur',
									initialValue: formData.mobile,
									rules: [
										{ required: true, message: '请填写手机号码' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='身份证号'>
							{
								getFieldDecorator('idCode', {
									validateTrigger: 'onBlur',
									initialValue: formData.idCode,
									rules: [
										{ required: true, message: '请填写身份证号' },
										{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='所属体系'>
							{
								getFieldDecorator('agentProgramId', {
									validateTrigger: 'onBlur',
									initialValue: formData.agentProgramId,
									rules: [
										{ required: true, message: '请选择所属体系' }
									]
								})(
									<Select onChange={this.handleAgentProgramIdChanged} allowClear>
										{agentPrograms.map(program => <Option value={program.agentProgramId}>{program.agentProgramName}</Option>)}
									</Select>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='代理人编号'>
							{
								getFieldDecorator('agentCode', {
									validateTrigger: 'onBlur',
									initialValue: formData.agentCode,
									rules: [
										{ required: true, message: '请填写代理人编号' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='微信号'>
							{
								getFieldDecorator('wechatCode', {
									initialValue: formData.wechatCode
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='QQ号'>
							{
								getFieldDecorator('qqCode', {
									initialValue: formData.qqCode
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='代理类型'>
							{
								getFieldDecorator('agentCategory', {
									validateTrigger: 'onBlur',
									initialValue: formData.agentCategory,
									rules: [
										{ required: true, message: '请选择代理类型' }
									]
								})(
									<Select onChange={this.handleAgentTypeChange}>
										{agentCategories.map(category => <Option value={category.columnValue}>{category.valueDesc}</Option>)}
									</Select>
								)
							}
						</FormItem>
						{ showEmployee &&
							<FormItem {...formItemLayout} label='关联员工'>
								{
									getFieldDecorator('contactId', {
										validateTrigger: 'onBlur',
										initialValue: formData.contactId,
										rules: [{
											required: true, message: '请关联员工'
										}]
									})(
										<Select {...employeeSelectProps}>
											{
												Object.keys(staffList).map(item =>
													(<OptGroup label={item}>
														{staffList[item].map(items => <Option value={items.employeeId}>{items.employeeName}</Option>)}
													</OptGroup>))
											}
										</Select>
									)
								}
							</FormItem>
						}
						{ showAgentLevel &&
						<FormItem {...formItemLayout} label='代理等级'>
							{
								getFieldDecorator('agentTier', {
									validateTrigger: 'onBlur',
									initialValue: formData.agentTier,
									rules: [
										{ required: true, message: '请选择代理等级' }
									]
								})(
									<Select onChange={this.handleAgentTierChange}>
										{ agentTiers.map(tier => <Option value={tier.columnValue}>{tier.valueDesc}</Option>)}
									</Select>
								)
							}
						</FormItem>
						}
						<FormItem {...formItemLayout} label='备注'>
							{
								getFieldDecorator('agentDesc', {
									initialValue: formData.agentDesc
								})(<TextArea rows={4} />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='上级代理人'>
							{
								getFieldDecorator('fAgentId', {
									initialValue: formData.parent ? formData.parent.agentId : null
								})(
									<Select {...superiorSelectProps}>
										{ agentList.map(agent => <Option value={agent.agentId}>{agent.contactName}({agent.mobile})</Option>)}
									</Select>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='业务负责人'>
							{
								getFieldDecorator('positionIdSet', {
									initialValue: formData.positionIdSet || []
								})(
									<Select {...principleSelectProps} disabled={hasFAgent}>
										{
											selectedPrincipal.map(
												item => <Option value={item.positionId}>{`${item.employeeName}-${item.positionName}`}</Option>
											)
										}
									</Select>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='所属团队' >
							{
								getFieldDecorator('deptIdSet', {
									initialValue: formData.deptIdSet || []
								})(
									<TreeSelect {...deptTreeSelectProps} disabled={hasFAgent}>
										{this.renderTreeNodes(deptTreeData)}
									</TreeSelect>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='状态'>
							{
								getFieldDecorator('agentStatus', {
									initialValue: formData.agentStatus
								})(
									<Select>
										{ agentStatuses.map(status => <Option value={status.columnValue}>{status.valueDesc}</Option>) }
									</Select>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='开户银行'>
							{
								getFieldDecorator('asscBank', {
									initialValue: formData.asscBank
								})(
									<Select allowClear onChange={val => this.handleAsscBankChange(val)}>
										{ banks.map(bank => <Option value={bank.columnValue}>{bank.valueDesc}</Option>)}
									</Select>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='银行卡号'>
							{
								getFieldDecorator('asscBankAcct', {
									validateTrigger: 'onBlur',
									initialValue: formData.asscBankAcct,
									rules: [
										{ required: needBankAcct, message: '请填写银行卡号' },
										{ pattern: /^\d+$/, message: '请输入正确的银行卡号' }
									]
								})(<Input />)
							}
						</FormItem>
					</Col>
				</Row>
				<Row type='flex' justify='center'>
					<Col>
						<Button key='save' type='primary' size='large' onClick={this.handleSave} loading={btnLoading}>保存</Button>
					</Col>
				</Row>
			</Form>
		)
	}
}

export default Form.create()(AgentForm)
