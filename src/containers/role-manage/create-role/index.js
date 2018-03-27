import React, { Component } from 'react'
import { Row, Col, Input, Switch, Form, Button, message } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 12
	}
}
class CreateRoleForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isBtnLoading: false,
			formData: {},
			isCreate: !this.props.match.params.roleId // 是否是创建页面
		}
	}
	componentWillMount() {
		this._getRoleData(this.props.match.params.roleId)
	}
	_getRoleData = (roleId) => {
		if (this.state.isCreate) return
		request.send(HTTP_CMD.ROLE_DETAIL, { roleId }).then((res) => {
			this.setState({ formData: res.data })
		})
	}
	checkRoleName = (rule, value, callback) => {
		if (!this.state.isCreate) {
			callback()
			return
		}
		request.send(HTTP_CMD.IS_ROLE_REPEAT, { roleName: value }).then((res) => {
			if (res.data === 1) { // 角色名已存在
				callback('该角色名已存在')
				return
			}
			callback()
		})
	}
	save = tag => (e) => {
		e.preventDefault()
		const form = this.props.form
		form.validateFields((err, values) => {
			const data = { ...values }
			data.roleStatus = data.roleStatus ? 1 : 0
			data.roleId = this.props.match.params.roleId || ''
			if (!err) {
				this.setState({ isBtnLoading: true })
				request.send(this.state.isCreate ? HTTP_CMD.ROLE_CREATE : HTTP_CMD.ROLE_MODIFY, data).then((res) => {
					this.setState({ isBtnLoading: false })
					message.success(`${this.state.isCreate ? '创建角色成功！' : '编辑角色成功！'}`)
					if (tag === 1) {
						this.props.history.replace('/app/role-manage')
					} else {
						this.props.history.replace(`/app/role-manage/role-detail/${res.data}`)
					}
				}).catch(() => {
					this.setState({ isBtnLoading: false })
				})
			}
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const { formData } = this.state
		return (
			<Form onSubmit={this.handleSubmit} >
				<Row type='flex' justify='center'>
					<Col span={20}>
						<FormItem
							{...formItemLayout}
							label='角色名称'
							colon={false}
						>
							{getFieldDecorator('roleName', {
								validateFirst: true,
								validateTrigger: 'onBlur',
								initialValue: formData.roleName,
								rules: [
									{ required: true, max: 20, message: '必填，文本，最多20个字符' },
									{ validator: this.checkRoleName }
								]
							})(
								<Input placeholder='输入角色名称' />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='角色描述'
							colon={false}
						>
							{getFieldDecorator('roleDesc', {
								rules: [{ max: 200, message: '最多200个字符' }],
								validateTrigger: 'onBlur',
								initialValue: formData.roleDesc
							})(
								<Input.TextArea placeholder='请输入角色描述' autosize={{ minRows: 4, maxRows: 10 }} />
							)}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label='是否启用'
							colon={false}
						>
							{getFieldDecorator('roleStatus', {
								valuePropName: 'checked',
								initialValue: !!formData.roleStatus
							})(
								<Switch />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row type='flex' justify='center' >
					<Col>
						<Button
							style={{ marginRight: 10 }}
							type='primary'
							loading={this.state.isBtnLoading}
							onClick={this.save(1)}
						>
							保存
						</Button>
						<Button
							type='primary'
							loading={this.state.isBtnLoading}
							onClick={this.save(2)}
						>
							保存并配置功能
						</Button>
					</Col>
				</Row>
			</Form>
		)
	}
}
const CreateRole = Form.create()(CreateRoleForm)
export default CreateRole
