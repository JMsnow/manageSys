import React, { Component } from 'react'
import { Row, Col, Input, Select, Form, Button, Card, TreeSelect, message } from 'antd'

const TreeNode = TreeSelect.TreeNode
const { Option } = Select
const FormItem = Form.Item
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 12
	}
}

class CreateClientForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			btnLoading: false,
			formData: {},
			isCreate: !this.props.match.params.clientId, // 是否是创建页面
			deptTreeData: [], // 选择的组织
			selectedPrincipal: [], // 选择的负责人
			selectedPerson: [] // 选择的个人
		}
	}

	componentWillMount() {
		debug.log(98989)
		if (!this.state.isCreate) {
			this._loadClientData(this.props.location.state.record)
		}
		this._loadPrincipalData('')
		this._loadPersonData('')
		this._loadDepartTree()
	}

	_loadClientData = (record) => { // 获取用户详情
		if (this.state.isCreate) return
		request.send(
			HTTP_CMD.CLIENT_DETAIL,
			{ customerId: record.customerId, customerType: record.customerType }
		)
			.then((res) => {
				this.setState({ formData: res.data })
			})
	}

	_loadPrincipalData = (value) => { // 获取负责人下拉列表数据
		request.send(HTTP_CMD.SELECT_PRINCIPAL, { keywords: value }).then((res) => {
			this.setState({ selectedPrincipal: res.data })
		})
	}

	_loadDepartTree = () => { // 获取部门下拉列表数据
		request.send(HTTP_CMD.DEPT_LIST_ALL_ORG).then((res) => {
			this.setState({
				deptTreeData: helper.generateJsonTree(res.data)
			})
		})
	}

	_loadPersonData = (keywords) => { // 获取个人下拉列表数据
		request.send(HTTP_CMD.SELECT_PERSON, { keywords }).then((res) => {
			this.setState({ selectedPerson: res.data })
		})
	}


	checkIdCode = (rule, value, callback) => { // 查询识别码编号是否重复
		const { getFieldValue } = this.props.form
		const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
		const orgReg = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]/
		if (getFieldValue('idType') === '0' && !idReg.test(value)) {
			callback('请填写正确的身份证号码')
			return
		}
		if (getFieldValue('idType') === '8' && !orgReg.test(value)) {
			callback('请填写正确的组织机构代码')
			return
		}
		request.send(
			HTTP_CMD.IDCODE_ISEXIST,
			{
				customerType: getFieldValue('customerType'),
				idType: getFieldValue('idType'),
				idCode: value
			}
		)
			.then((res) => {
				if (res === 2) {
					callback('该识别码已被使用')
				}
			})
		callback()
	}

	handelChangeClientType = (value) => {
		const { setFieldsValue } = this.props.form
		setFieldsValue({ idCode: '' })
		if (value === '0') {
			setFieldsValue({ idType: '0' })
		}
		if (value === '1') {
			setFieldsValue({ idType: '8' })
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const form = this.props.form
		form.validateFields((err, values) => {
			const data = { ...values, customerId: this.props.match.params.clientId }
			const url = this.state.isCreate ? HTTP_CMD.CREATE_CLIENT : HTTP_CMD.CLIENT_MODIFY
			if (!err) {
				this.setState({ btnLoading: true })
				request.send(url, data).then(() => {
					this.setState({ btnLoading: false })
					message.success(`${this.state.isCreate ? '创建客户成功！' : '编辑客户成功！'}`)
					this.props.history.goBack()
				}).catch(() => {
					this.setState({ btnLoading: false })
				})
			}
		})
	}

	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.deptName} value={`${item.deptId}`} key={item.deptId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} value={item.deptId} key={item.deptId} />
	})

	renderPrincipalSelect = () => (
		<Select
			showSearch
			optionFilterProp='children'
			mode='multiple'
			placeholder='请选择业务负责人'
		>
			{
				this.state.selectedPrincipal.map(
					item => <Option value={`${item.positionId}`}>{`${item.employeeName}-${item.positionName}`}</Option>
				)
			}
		</Select>
	)

	renderPersonSelect = () => (
		<Select
			showSearch
			optionFilterProp='children'
			mode='multiple'
			placeholder='请选择个人'
		>
			{
				this.state.selectedPerson.map(
					item => <Option value={`${item.contactId}`}>{item.contactName}</Option>
				)
			}
		</Select>
	)

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form
		const { formData, isCreate } = this.state
		if (!isCreate && !formData.boPositionDtoList) {
			return <span>Loading...</span>
		}
		return (
			<Form style={{ maxWidth: '100%', margin: '10px auto' }} onSubmit={this.handleSubmit}>
				<Row type='flex' justify='center'>
					<Col span={16}>
						<FormItem
							{...formItemLayout}
							label='客户类型'
							colon={false}
						>
							{getFieldDecorator('customerType', {
								initialValue: isCreate ? '0' : formData.customerType
							})(
								<Select onChange={this.handelChangeClientType}>
									<Option value='0'>个人</Option>
									<Option value='1'>机构</Option>
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='客户名称'
							colon={false}
						>
							{getFieldDecorator('customerName', {
								validateTrigger: 'onBlur',
								rules: [{ required: true, max: 20, message: '必填，20字符以内' }],
								initialValue: isCreate ? '' : formData.customerName
							})(
								<Input placeholder='输入客户名称' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='识别码类型'
							colon={false}
						>
							{getFieldDecorator('idType', {
								validateFirst: true,
								validateTrigger: 'onBlur',
								rules: [
									{ required: true, message: '请输入识别码编号' }
								],
								initialValue: isCreate ? '0' : formData.idType
							})(
								<Select placeholder='请选择识别码类型'>
									{
										CONFIG.accountTypes.map((item, index) => {
											if (getFieldValue('customerType') === '0' && index === 0) {
												return <Option value={`${index}`}>{item}</Option>
											}
											if (getFieldValue('customerType') === '1' && index === 8) {
												return <Option value={`${index}`}>{item}</Option>
											}
											return null
										})
									}
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='识别码编号'
							colon={false}
						>
							{getFieldDecorator('idCode', {
								validateFirst: true,
								validateTrigger: 'onBlur',
								initialValue: isCreate ? '' : formData.idCode,
								rules: [
									{ required: true, message: '请输入识别码编号' },
									{ validator: this.checkIdCode }
								]
							})(
								<Input placeholder='输入识别码编号' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='电话号码'
							colon={false}
						>
							{getFieldDecorator('mobile', {
								validateTrigger: 'onBlur',
								initialValue: isCreate ? '' : formData.mobile,
								validateFirst: true,
								rules: [
									{ required: true, message: '请输入电话号码' },
									{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的电话号码' }
								]
							})(
								<Input placeholder='输入电话号码' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='邮箱'
							colon={false}
						>
							{getFieldDecorator('email', {
								validateTrigger: 'onBlur',
								initialValue: isCreate ? '' : formData.email,
								rules: [
									{ type: 'email', message: '请输入正确的邮箱' }
								]
							})(
								<Input placeholder='输入邮箱' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='客户状态'
							colon={false}
						>
							{getFieldDecorator('isActive', {
								initialValue: isCreate ? '1' : `${formData.isActive}`
							})(
								<Select>
									<Option value='0'>无效</Option>
									<Option value='1'>正常</Option>
								</Select>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='业务负责人'
							colon={false}
						>
							{getFieldDecorator('positionIdList', {
								initialValue: isCreate ? [] : formData.boPositionDtoList.map(item => `${item.positionId}`)
							})(
								this.renderPrincipalSelect()
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='所属组织'
							colon={false}
						>
							{getFieldDecorator('orgIdList', {
								initialValue: isCreate ? [] : formData.boOrgDtoList.map(item => `${item.deptId}`)
							})(
								<TreeSelect
									dropdownMatchSelectWidth
									multiple
									showSearch
									placeholder='请选择所属部门'
									treeNodeFilterProp='title'
								>
									{this.renderTreeNodes(this.state.deptTreeData)}
								</TreeSelect>
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='所属个人'
							colon={false}
						>
							{getFieldDecorator('personIdList', {
								initialValue: isCreate ? [] : formData.boPersonDtoList.map(item => `${item.contactId}`)
							})(
								this.renderPersonSelect()
							)}
						</FormItem>
					</Col>
				</Row>
				<Row type='flex' justify='center' style={{ marginTop: 40 }}>
					<Col>
						<FormItem>
							<Button
								style={{ marginRight: 20 }}
								type='primary'
								loading={this.state.btnLoading}
								htmlType='submit'
							>
								保存
							</Button>
						</FormItem>
					</Col>
				</Row>
			</Form>
		)
	}
}
const CreateClient = Form.create()(CreateClientForm)
export default CreateClient
