import React, { Component } from 'react'
import { Modal, Form, Input, Table, Icon, InputNumber, Radio, message } from 'antd'
import Selects from 'containers/rules-manage/selects'
import style from './style.scss'

const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 14
	}
}

class RuleItemsForm extends Component {
	state = {
		ruleItems: [],
		count: 0,
		orgs: [],
		btnLoading: false
	}

	componentWillMount() {
		const { commRuleItemDetail } = this.props

		helper.queryAllFields('cond_object').then((data) => {
			this.setState({ condObject: data })
			if (!commRuleItemDetail) return
			setTimeout(() => {
				this._setInitRuleItems()
			}, 100)
		})
		helper.queryAllFields('cond_object_attr').then((data) => {
			this.setState({ condObjectAttr: data })
			if (!commRuleItemDetail) return
			setTimeout(() => {
				this._setInitRuleItems()
			}, 100)
		})
		helper.queryAllFields('cond_operator').then((data) => {
			this.setState({ condOperator: data })
			if (!commRuleItemDetail) return
			setTimeout(() => {
				this._setInitRuleItems()
			}, 100)
		})
		request.send(HTTP_CMD.RULES_ORG, { agentProgramId: this.props.agentProgramId })
			.then((res) => {
				this.setState({ orgs: res.data })
				if (!commRuleItemDetail) return
				setTimeout(() => {
					this._setInitRuleItems()
				}, 100)
			})
	}

	columns = [
		{
			title: '实体名',
			dataIndex: 'name',
			width: '20%',
			render: name => (name ? name.desc : null)
		},
		{
			title: '字段名',
			dataIndex: 'field',
			width: '20%',
			render: field => (field ? field.desc : null)
		},
		{
			title: '运算符',
			dataIndex: 'calculate',
			width: '20%',
			render: calculate => (calculate ? calculate.desc : null)
		},
		{
			title: '比较值',
			dataIndex: 'compare',
			width: '20%',
			render: compare => (compare ? compare.desc : null)
		},
		{
			title: '操作',
			dataIndex: 'key',
			width: '15%',
			render: count => <a onClick={() => this.handleDelete(count)}><Icon type='delete' style={{ fontSize: 16 }} /></a>
		}
	]

	_setInitRuleItems = () => {
		const { commRuleItemDetail } = this.props
		const { condObject, condObjectAttr, condOperator, orgs } = this.state
		if (!commRuleItemDetail || orgs.length === 0) {
			return
		}
		const initRuleItems = commRuleItemDetail.commisionRuleItemConditionsDtoList.map((item, index) => (
			{
				key: index,
				name: { val: item.condObject, desc: condObject.find(items => items.columnValue === item.condObject).valueDesc },
				field: { val: item.condObjectAttr, desc: condObjectAttr.find(items => items.columnValue === item.condObjectAttr).valueDesc },
				calculate: { val: item.condOperator, desc: condOperator.find(items => items.columnValue === item.condOperator).valueDesc },
				compare: {
					val: item.condNumberValue || item.condCharValue,
					desc: item.condNumberValue ||
						orgs.filter(items => item.condCharValue.split(',').indexOf(`${items.deptId}`) > -1)
							.map(i => i.deptName)
							.join(',')
				}
			}
		))
		this.setState({ ruleItems: initRuleItems, count: initRuleItems.length })
	}

	handleDelete = (key) => {
		this.setState({
			ruleItems: this.state.ruleItems.filter(item => item.key !== key)
		})
	}

	handleFilterExistent = (rule, value, callback) => {
		request.send(HTTP_CMD.RULES_ITEM_CODE_EXIST, { commRuleItemCode: value })
			.then((res) => {
				if (res.data === 2) {
					callback('该编码已经存在')
					return
				}
				callback()
			})
	}

	handleSave = (obj) => {
		this.setState({
			ruleItems: [...this.state.ruleItems, { ...obj, key: this.state.count }],
			count: this.state.count + 1
		})
	}

	handleOk = () => {
		const filterArr = ['1', '3', '4']
		const form = this.props.form
		let reqData = {}
		if (this.state.ruleItems.find(item => item.editable)) {
			message.warning('请先保存当前编辑项')
			return
		}
		form.validateFields((err, values) => {
			reqData = {
				commRuleItemCode: values.commRuleItemCode,
				commRuleItemDesc: values.commRuleItemDesc,
				commRuleItemRemark: values.commRuleItemRemark,
				commRuleId: this.props.currentRuleId,
				commisionRuleItemActionsDtoList: [
					{ commModel: values.commModel, commAgent: 0, commQuantity: values.commZero },
					{ commModel: values.commModel, commAgent: 1, commQuantity: values.commOne },
					{ commModel: values.commModel, commAgent: 2, commQuantity: values.commTwo }
				],
				commisionRuleItemConditionsDtoList: this.state.ruleItems.map(item => (
					{
						condObject: item.name.val,
						condObjectAttr: item.field.val,
						condOperator: item.calculate.val,
						condCharValue: filterArr.indexOf(`${item.field.val}`) > -1 ? '' : item.compare.val,
						condNumberValue: filterArr.indexOf(`${item.field.val}`) > -1 ? item.compare.val : ''
					}
				))
			}

			if (!err) {
				this.setState({ btnLoading: true })
				request.send(HTTP_CMD.RULES_ITEM_CREATE, reqData).then(() => {
					this.setState({ btnLoading: false })
					this.props.onOk()
				}).catch((res) => {
					message.error(res.msg)
					this.setState({ btnLoading: false })
				})
			}
		})
	}

	renderInput = (commModel) => {
		if (commModel === 1) {
			return (
				<InputNumber
					min={0}
					max={100}
					formatter={value => `${value}%`}
					parser={value => value.replace('%', '')}
				/>
			)
		}
		return (
			<InputNumber
				min={0}
				formatter={value => `${value}元`}
				parser={value => value.replace('元', '')}
			/>
		)
	}

	render() {
		const { commRuleItemDetail } = this.props
		const { getFieldDecorator, getFieldValue } = this.props.form

		return (
			<Modal
				className={style.wrap}
				width='800'
				bodyStyle={{ height: '700px', overflowY: 'auto' }}
				closable={false}
				title='添加规则细则'
				visible
				onOk={this.handleOk}
				confirmLoading={this.state.btnLoading}
				onCancel={this.props.onCancel}
			>
				<Form>
					<FormItem
						{...formItemLayout}
						label='细则描述'
						colon={false}
					>
						{getFieldDecorator('commRuleItemDesc', {
							validateTrigger: 'onBlur',
							initialValue: commRuleItemDetail ? commRuleItemDetail.commRuleItemDesc : '',
							rules: [
								{ required: true, message: '请输入描述' },
								{ max: 200, message: '最多200字符' }
							]
						})(
							<TextArea placeholder='请输入描述' autosize={{ minRows: 1, maxRows: 5 }} />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='细则编号'
						colon={false}
					>
						{getFieldDecorator('commRuleItemCode', {
							validateFirst: true,
							validateTrigger: 'onBlur',
							initialValue: '',
							rules: [
								{ required: true, message: '请输入规则编码' },
								{ pattern: /^[A-Za-z][A-Za-z0-9]{5,15}$/, message: '6~16位字母，数字(以字母开头)' },
								{ validator: this.handleFilterExistent }
							]
						})(
							<Input placeholder='请输入规则编码' />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='备注'
						colon={false}
					>
						{getFieldDecorator('commRuleItemRemark', {
							initialValue: commRuleItemDetail ? commRuleItemDetail.commRuleItemRemark : '',
							rules: [{ max: 200, message: '最多200字符' }]
						})(
							<TextArea placeholder='请输入备注' autosize={{ minRows: 1, maxRows: 5 }} />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='返佣方式'
						colon={false}
					>
						{getFieldDecorator('commModel', {
							initialValue: commRuleItemDetail ? commRuleItemDetail.commModel : 0,
							rules: [{ required: true, message: '请输入规则编码' }]
						})(
							<RadioGroup>
								<Radio value={0}>金额</Radio>
								<Radio value={1}>百分比</Radio>
							</RadioGroup>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='直销返佣额度'
						colon={false}
					>
						{getFieldDecorator('commZero', {
							initialValue: commRuleItemDetail ? commRuleItemDetail.commQuantityLevelFirst : 0,
							rules: [{ required: true, message: '请输入规则编码' }]
						})(
							this.renderInput(getFieldValue('commModel'))
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='一级上线返佣'
						colon={false}
					>
						{getFieldDecorator('commOne', {
							initialValue: commRuleItemDetail ? commRuleItemDetail.commQuantityLevelSecond : 0,
							rules: [{ required: true, message: '请输入规则编码' }]
						})(
							this.renderInput(getFieldValue('commModel'))
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='二级上线返佣'
						colon={false}
					>
						{getFieldDecorator('commTwo', {
							initialValue: commRuleItemDetail ? commRuleItemDetail.commQuantityLevelThird : 0,
							rules: [{ required: true, message: '请输入规则编码' }]
						})(
							this.renderInput(getFieldValue('commModel'))
						)}
					</FormItem>
					<div className='tableTitle'>
						<span>细则条件</span>
					</div>
					<Table
						rowKey='key'
						dataSource={this.state.ruleItems}
						columns={this.columns}
						pagination={false}
						title={() => <Selects onSave={this.handleSave} agentProgramId={this.props.agentProgramId} orgs={this.state.orgs} />}
					/>
				</Form>
			</Modal>
		)
	}
}

const RuleItems = Form.create()(RuleItemsForm)

export default RuleItems
