import React, { Component } from 'react'
import { Row, Col, Input, Select, Switch, Form, Button, message } from 'antd'

const { Option, OptGroup } = Select

const FormItem = Form.Item
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 12
	}
}

class CreateUserForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			btnLoading: false,
			formData: {},
			isCreate: !this.props.match.params.userId, // 是否是创建页面
			staffList: []
		}
	}
	componentWillMount() {
		this._getUserData(this.props.match.params.userId)
		this._getStaffsData()
	}
	_getUserData = (userId) => {
		if (this.state.isCreate) return
		request.send(HTTP_CMD.USER_DETAIL, { userId }).then((res) => {
			this.setState({ formData: res.data })
		})
	}
	_getStaffsData = () => {
		request.send(HTTP_CMD.USER_CREATE_SELETC_STAFF, { employeeName: '' }).then((res) => {
			this.setState({ staffList: res.data })
		})
	}
	handleSearch = (value) => {
		request.send(HTTP_CMD.USER_CREATE_SELETC_STAFF, { employeeName: value }).then((res) => {
			this.setState({ staffList: res.data })
		})
	}
	checkLoginName = (rule, value, callback) => {
		if (!this.state.isCreate) {
			callback()
			return
		}
		request.send(HTTP_CMD.QUERY_USER_ACCOUNT, { loginName: value }).then((res) => {
			if (res.data === 1) { // 账号已存在
				callback('该账号已存在')
				return
			}
			callback()
		})
	}
	checkPassword = (rule, value, callback) => {
		const form = this.props.form
		const reg = /[^\u4e00-\u9fa5]{6,16}/
		if (!reg.test(value)) {
			callback('6~16非中文字符')
		} else if (form.getFieldValue('loginName') && value === form.getFieldValue('loginName')) {
			callback('密码与账号不能相同')
		} else {
			callback()
		}
	}
	save = tag => (e) => {
		e.preventDefault()
		const form = this.props.form
		form.validateFields((err, values) => {
			const data = { ...values }
			data.userStatus = data.userStatus ? 1 : 0
			data.isInternalUser = data.isInternalUser ? 1 : 0
			data.userId = this.props.match.params.userId || ''
			if (!err) {
				this.setState({ btnLoading: true })
				request.send(this.state.isCreate ? HTTP_CMD.CREATE_USER : HTTP_CMD.USER_MODIFY, data).then((res) => {
					this.setState({ btnLoading: false })
					message.success(`${this.state.isCreate ? '创建用户成功！' : '编辑用户成功！'}`)
					if (tag === 1) {
						this.props.history.replace('/app/user-manage')
					} else {
						this.props.history.replace(`/app/user-manage/user-detail/${res.data}`)
					}
				}).catch(() => {
					this.setState({ btnLoading: false })
				})
			}
		})
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form
		const { formData, isCreate } = this.state
		return (
			<Form style={{ maxWidth: '100%', margin: '10px auto' }} onSubmit={this.handleSubmit}>
				<Row type='flex' justify='center'>
					<Col span={20}>
						<FormItem
							{...formItemLayout}
							label='用户账号'
							colon={false}
						>
							{getFieldDecorator('loginName', {
								validateFirst: true,
								validateTrigger: 'onBlur',
								initialValue: isCreate ? '' : formData.loginName,
								rules: [
									{ required: true, message: '请输入账号' },
									{ pattern: /^[A-Za-z0-9]{6,28}$/, message: '6~28位字母，数字(以字母开头)' },
									{ validator: this.checkLoginName }
								]
							})(
								<Input placeholder='输入用户账号' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='账号类型'
							colon={false}
						>
							{getFieldDecorator('loginType', {
								validateTrigger: 'onBlur',
								initialValue: isCreate ? '13' : formData.loginType
							})(
								<Select>
									<Select.Option value='13'>内部账号</Select.Option>
									{/* <Select.Option value='14'>OpenId</Select.Option> */}
								</Select>
							)}
						</FormItem>
						{
							this.state.isCreate ?
								<FormItem
									{...formItemLayout}
									label='用户密码'
									colon={false}
								>
									{getFieldDecorator('loginPwd', {
										validateTrigger: 'onBlur',
										validateFirst: true,
										rules: [
											{ required: true, message: '请输入密码' },
											{ validator: this.checkPassword }
										]
									})(
										<sapn>
											<Input type='password' style={{ display: 'none' }} />
											<Input placeholder='请输入密码' type='password' autocomplete='new-password' />
										</sapn>
									)}
								</FormItem>
								: null
						}
						<FormItem
							{...formItemLayout}
							label='昵称'
							colon={false}
						>
							{getFieldDecorator('nickName', {
								validateTrigger: 'onBlur',
								initialValue: isCreate ? '' : formData.nickName,
								rules: [
									{ required: true, message: '请输入昵称' },
									{ max: 20, message: '最多20字符' }
								]
							})(
								<Input placeholder='输入昵称' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='是否启用'
							colon={false}
						>
							{getFieldDecorator('userStatus', {
								valuePropName: 'checked',
								initialValue: isCreate ? true : !!formData.userStatus
							})(
								<Switch />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='是否员工'
							colon={false}
						>
							{getFieldDecorator('isInternalUser', {
								valuePropName: 'checked',
								initialValue: isCreate ? true : !!formData.isInternalUser
							})(
								<Switch />
							)}
						</FormItem>
						{
							getFieldValue('isInternalUser') ?
								<FormItem
									{...formItemLayout}
									label='选择员工'
									colon={false}
								>
									{getFieldDecorator('employeeId', {
										validateTrigger: 'onChange',
										initialValue: isCreate ? '' : formData.employeeId,
										rules: [{ required: true, message: '请选择员工' }]
									})(
										<Select
											showSearch
											allowClear
											placeholder='请选择员工'
											filterOption={false}
											onSearch={utils.debounce(this.handleSearch, 400)}
											onChange={this.handleChange}
										>
											{
												Object.keys(this.state.staffList).map(item =>
													(<OptGroup label={item}>
														{this.state.staffList[item].map(items => <Option value={items.employeeId}>{items.employeeName}</Option>)}
													</OptGroup>))
											}
										</Select>
									)}
								</FormItem> : null
						}
					</Col>
				</Row>
				<Row type='flex' justify='center' style={{ marginTop: 40 }}>
					<Col>
						<Button
							style={{ marginRight: 20 }}
							type='primary'
							loading={this.state.btnLoading}
							onClick={this.save(1)}
						>
							保存
						</Button>
						<Button
							type='primary'
							loading={this.state.btnLoading}
							onClick={this.save(2)}
						>
							保存并配置
						</Button>
					</Col>
				</Row>
			</Form>
		)
	}
}
const CreateUser = Form.create()(CreateUserForm)
export default CreateUser
