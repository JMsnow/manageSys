import React from 'react'
import { Input, Form, Button, InputNumber, DatePicker, Select, Table, Row, Col, message } from 'antd'
import moment from 'moment'
import AuthBtn from 'components/auth-button'
import RuleItems from 'containers/rules-manage/rules-items'
import style from './style.scss'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const TextArea = Input.TextArea
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 14 }
	}
}

class RulesCreateForm extends React.Component {
	state = {
		formInitData: {},
		productList: [],
		distributionList: [],
		currentRuleId: '', // 当前规则ID
		commRuleItemDetail: '', // 被复制的规则细则详情
		commModel: [], // 分佣模式
		tableData: [],
		isCreate: !this.props.match.params.id,
		btnLoading: false,
		tableLoading: false,
		isShowModal: false
	}

	componentWillMount() {
		const { isCreate } = this.state
		if (!isCreate) {
			this.setState({ currentRuleId: this.props.match.params.id })
			this._getFormInitData()
		}
		helper.queryAllFields('comm_model').then((data) => { // 获取分佣模式集合
			this.setState({
				commModel: data
			})
		})
		this._getProductData()
		this._getDistributionData()
	}

	_getFormInitData = () => { // 编辑状态下加载表单初始数据
		request.send(HTTP_CMD.RULES_DETAIL, { commRuleId: this.props.match.params.id || this.state.currentRuleId }).then((res) => {
			this.setState({
				formInitData: res.data,
				tableData: res.data.commisionRuleItemDtoList
			})
		})
	}

	_getProductData = () => { // 加载产品下拉列表数据
		const reqData = {
			current: 1,
			size: 1000000,
			condition: { keywords: '' }
		}
		request.send(HTTP_CMD.PRODUCT_LIST, reqData).then((res) => {
			this.setState({
				productList: res.data.records
			})
		})
	}

	_getDistributionData = () => { // 加载分销体系下拉列表数据
		request.send(HTTP_CMD.RULES_AGENTS_PROGRAM).then((res) => {
			this.setState({
				distributionList: res.data
			})
		})
	}

	_save = () => { // 保存规则主体信息，生成规则ID
		const form = this.props.form
		const reqUrl = this.state.isCreate ? HTTP_CMD.RULES_CREATE : HTTP_CMD.RULES_MODIFY
		let reqData = {}

		return new Promise((resolve) => {
			form.validateFields((err, values) => {
				reqData = {
					...values,
					commRuleId: this.state.isCreate ? '' : this.state.currentRuleId,
					startDt: values.dateRange.length === 2 ? values.dateRange[0].format('YYYY-MM-DD') : '',
					endDt: values.dateRange.length === 2 ? values.dateRange[1].format('YYYY-MM-DD') : ''
				}

				if (!err) {
					request.send(reqUrl, reqData).then((res) => {
						resolve(res.data)
					}).catch((res) => {
						message.error(`${res.code}:${res.msg}`)
					})
				}
			})
		})
	}

	handleFilterExistent = (rule, value, callback) => {
		const { formInitData } = this.state

		if (formInitData.commRuleCode === value) {
			callback()
			return
		}
		request.send(HTTP_CMD.COMM_CODE_EXIST, { commRuleCode: value })
			.then((res) => {
				if (res.data === 2) {
					callback('该编码已经存在')
					return
				}
				callback()
			})
	}

	handleAddRuleItem = () => {
		if (this.state.isCreate && !this.state.currentRuleId) {
			this._save().then((ruleId) => {
				this.setState({ currentRuleId: ruleId })
				setTimeout(() => {
					this.setState({ isShowModal: true })
				}, 100)
			})
			return
		}
		this.setState({ isShowModal: true })
	}

	handleSaveRuleItem = () => {
		this._getFormInitData()
		this.setState({ isShowModal: false, commRuleItemDetail: '' })
	}

	handleSubmit = (tag) => {
		this.setState({ btnLoading: true })
		this._save().then((ruleId) => {
			request.send(HTTP_CMD.RULES_UPDATE_STATUS, { commRuleIdList: [ruleId], commRuleStatus: tag }).then(() => {
				this.setState({ btnLoading: false })
				message.success('保存成功')
				this.props.history.goBack()
			}).catch((res) => {
				message.error(res.msg)
				this.setState({ btnLoading: false })
			})
		})
	}

	handleDelete = (commRuleItemId) => {
		helper.confirm('确定删除该细则吗？').then(() => {
			request.send(HTTP_CMD.RULES_ITEM_DELETE, { commRuleItemId, commRuleId: this.state.currentRuleId })
				.then((res) => {
					message.success(res.msg)
					this._getFormInitData()
				})
		})
	}

	handleCopy = (record) => {
		this.setState({ isShowModal: true, commRuleItemDetail: record })
	}

	renderProductList = () => {
		const { productList } = this.state
		if (productList.length < 1) {
			return <Select />
		}
		return (
			<Select
				showSearch
				placeholder='请选择产品'
				optionFilterProp='children'
			>
				{productList.map(item => <Option value={item.productId}>{item.productName}</Option>)}
			</Select>
		)
	}

	renderDistributionList = () => {
		const { distributionList } = this.state
		if (distributionList.length < 1) {
			return <Select />
		}
		return (
			<Select
				showSearch
				placeholder='请选择体系'
				optionFilterProp='children'
			>
				{distributionList.map(item => <Option value={item.agentProgramId}>{item.agentProgramName}</Option>)}
			</Select>
		)
	}

	renderCommSum = (value, record) => {
		if (record.commModel === 1) {
			return <span>{value}%</span>
		}
		if (record.commModel === 0) {
			return <span>{value}元</span>
		}
		return null
	}

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form
		const { formInitData, isCreate, isShowModal, currentRuleId, commRuleItemDetail } = this.state
		const columns = [
			{
				title: '细则编号',
				dataIndex: 'commRuleItemCode'
			},
			{
				title: '描述',
				dataIndex: 'commRuleItemDesc'
			},
			{
				title: '返佣模式',
				dataIndex: 'commModel',
				render: (commModel) => {
					const status = this.state.commModel.filter(item => item.columnValue === commModel)[0]
					return <span>{status ? status.valueDesc : null}</span>
				}
			},
			{
				title: '直销返佣',
				dataIndex: 'commQuantityLevelFirst',
				render: this.renderCommSum
			},
			{
				title: '二级返佣',
				dataIndex: 'commQuantityLevelSecond',
				render: this.renderCommSum
			},
			{
				title: '三级返佣',
				dataIndex: 'commQuantityLevelThird',
				render: this.renderCommSum
			},
			{
				title: '操作',
				dataIndex: 'commRuleItemId',
				width: 200,
				render: (commRuleItemId, record) => (<div>
					<AuthBtn
						style={{ marginRight: 5 }}
						onClick={() => this.handleCopy(record)}
						actionId={ACTIONIDS_CMD.USER_MODIFY}
					>
						复制
					</AuthBtn>
					<AuthBtn
						onClick={() => this.handleDelete(commRuleItemId)}
						actionId={ACTIONIDS_CMD.USER_DELETE}
					>
						删除
					</AuthBtn>
				</div>)
			}
		]

		return (
			<div className={style.wrap}>
				<Form>
					<Row>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='规则名称'
								colon={false}
							>
								{getFieldDecorator('commRuleName', {
									validateFirst: true,
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formInitData.commRuleName,
									rules: [
										{ required: true, message: '请输入规则名称' }
									]
								})(
									<Input placeholder='请输入规则名称' />
								)}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='规则编码'
								colon={false}
							>
								{getFieldDecorator('commRuleCode', {
									validateFirst: true,
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formInitData.commRuleCode,
									rules: [
										{ required: true, message: '请输入规则编码' },
										{ pattern: /^[A-Za-z][A-Za-z0-9]{5,15}$/, message: '6~16位字母，数字(以字母开头)' },
										{ validator: this.handleFilterExistent }
									]
								})(
									<Input placeholder='请输入规则编码' />
								)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='适用产品'
								colon={false}
							>
								{getFieldDecorator('commRuleProdId', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formInitData.commRuleProdId,
									rules: [
										{ required: true, message: '请选择产品' }
									]
								})(this.renderProductList())}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='所属体系'
								colon={false}
							>
								{getFieldDecorator('agentProgramId', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? [] : formInitData.agentProgramId,
									rules: [
										{ required: true, message: '请选择体系' }
									]
								})(this.renderDistributionList())}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='到账时延'
								colon={false}
							>
								{getFieldDecorator('payDelay', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? 7 : formInitData.payDelay
								})(
									<InputNumber
										min={1}
										formatter={value => `${value}天`}
										parser={value => value.replace('天', '')}
									/>
								)}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='生效时间'
								colon={false}
							>
								{getFieldDecorator('dateRange', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? [] : [moment(formInitData.startDt), moment(formInitData.endDt)]
								})(
									<RangePicker />
								)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<FormItem
								{...formItemLayout}
								label='规则描述'
								colon={false}
							>
								{getFieldDecorator('commRuleDesc', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formInitData.commRuleDesc,
									rules: [{ max: 200, message: '最多200字符' }]
								})(
									<TextArea placeholder='请输入描述' autosize={{ minRows: 3, maxRows: 10 }} />
								)}
							</FormItem>
						</Col>
					</Row>
				</Form>
				<div>
					<div className='itemTitle'>
						<span>规则细则</span>
						<Button onClick={this.handleAddRuleItem}>添加</Button>
					</div>
					<Table
						rowKey='commRuleItemId'
						loading={this.state.tableLoading}
						columns={columns}
						dataSource={this.state.tableData}
					/>
				</div>
				<div style={{ marginTop: 40, textAlign: 'center' }}>
					<Button type='primary' loading={this.state.btnLoading} style={{ marginRight: 10 }} onClick={() => this.handleSubmit(1)}>
						保存
					</Button>
					<Button type='primary' loading={this.state.btnLoading} onClick={() => this.handleSubmit(2)}>
						保存并发布
					</Button>
				</div>
				{
					isShowModal ?
						<RuleItems
							agentProgramId={getFieldValue('agentProgramId')}
							commRuleItemDetail={commRuleItemDetail}
							currentRuleId={currentRuleId}
							onCancel={() => this.setState({ isShowModal: false, commRuleItemDetail: '' })}
							onOk={this.handleSaveRuleItem}
						/>
						: null
				}
			</div>
		)
	}
}

const RulesCreate = Form.create()(RulesCreateForm)
export default RulesCreate

