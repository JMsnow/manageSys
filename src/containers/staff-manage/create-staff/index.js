import { Row, Col, Button, Form, Input, Checkbox, TreeSelect, message } from 'antd'
import React, { Component } from 'react'

import GoBack from 'components/go-back'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 6
		}
	},
	wrapperCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 14
		}
	}
}

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 14,
			offset: 6
		}
	}
}

class CreateDepartment extends Component {
	state = {
		loading: false,
		isEdit: false,
		checkAccount: false,
		employeeId: '',
		positionTreeData: [],
		staff: {}
	}

	componentWillMount() {
		const { state } = this.props.location
		const { params } = this.props.match

		this.setState({
			isEdit: state.isEdit,
			employeeId: +params.id
		})
	}

	componentDidMount() {
		this.onLoadPositionTreeData()

		if (this.state.isEdit) {
			this.onLoadStaffDetail(this.state.employeeId)
		}
	}

	onLoadPositionTreeData = (treeNode) => {
		const _treeNode = treeNode

		return new Promise((resolve) => {
			if (_treeNode && _treeNode.props.children) {
				resolve()
				return
			}

			const params = _treeNode ?
				{
					fPositionId: _treeNode.props.eventKey
				} : {
					fPositionId: null
				}

			request.send(HTTP_CMD.POSTION_TREE_ASYNC, params).then((res) => {
				if (_treeNode) {
					_treeNode.props.dataRef.children = res.data

					this.setState({
						positionTreeData: [...this.state.positionTreeData]
					})
				} else {
					this.setState({
						positionTreeData: res.data
					})
				}

				resolve()
			})
		})
	}

	onLoadStaffDetail = (employeeId) => {
		request.send(HTTP_CMD.STAFF_DETAIL, {
			employeeId
		}).then((res) => {
			// const { setFieldsValue } = this.props.form
			const staff = res.data

			this.setState({
				staff,
				checkAccount: !!res.data.isUserAccount
			})

			// setFieldsValue({
			// 	employeeName: staff.employeeName,
			// 	employeeCode: staff.employeeCode,
			// 	positionId: staff.positionId,
			// 	email: staff.email,
			// 	mobile: staff.mobile,
			// 	employeeState: staff.employeeState,
			// 	isUserAccount: staff.isUserAccount,
			// 	loginName: staff.loginName,
			// 	loginPwd: staff.loginPwd
			// })
		})
	}

	handleSaveStaff = (e) => {
		e.preventDefault()

		const { validateFields } = this.props.form

		this.setState({ loading: true })

		validateFields((err, values) => {
			if (!err) {
				const params = {
					...values,
					employeeId: this.state.employeeId,
					employeeState: values.employeeState ? 1 : 0,
					isUserAccount: values.isUserAccount ? 1 : 0
				}

				debug.log(params)

				const CMD = this.state.isEdit ? HTTP_CMD.MODIFY_STAFF : HTTP_CMD.CREATE_STAFF

				request.send(CMD, params).then((res) => {
					message.success('操作成功')
					this.setState({ loading: false })
					this.goBack()
				}).catch(() => {
					this.setState({ loading: false })
				})
			} else {
				this.setState({ loading: false })
			}
		})
	}

	goBack = () => {
		const { history } = this.props
		this.handleReset()
		history.goBack()
	}

	handleReset = () => {
		this.props.form.resetFields()
	}

	handleChange = (e) => {
		this.setState({
			checkAccount: e.target.checked
		})
	}

	checkAccountExist = (rule, value, callback) => {
		const params = {
			loginName: value
		}

		if (!this.state.checkAccount || this.state.isEdit) {
			callback()
			return
		}

		request.send(HTTP_CMD.QUERY_USER_ACCOUNT, params).then((res) => {
			debug.dir(res)

			return res.data ? callback('用户账号已存在') : callback()
		})
	}

	checkMobileExisted = (rule, value, callback) => {
		if (!value || !value.length) {
			callback()
			return
		}

		const params = {
			mobile: value,
			contactId: this.state.employeeId
		}

		request.send(HTTP_CMD.CHECK_MOBILE_EXISTED, params).then(res => (
			res.data !== 0 ? callback('手机号已存在') : callback()
		))
	}

	checkEmailExisted = (rule, value, callback) => {
		if (!value || !value.length) {
			callback()
			return
		}

		const params = {
			email: value,
			contactId: this.state.employeeId
		}

		request.send(HTTP_CMD.CHECK_EMAIL_EXISTED, params).then(res => (
			res.data !== 0 ? callback('此邮箱已被使用') : callback()
		))
	}

	renderTreeNodes = data => data.map((item) => {
		const getTreeTitle = ({ positionName, deptName }) => (deptName ? `${positionName} - ${deptName}` : `${positionName}`)

		if (item.children) {
			return (
				<TreeNode title={getTreeTitle(item)} value={String(item.positionId)} key={item.positionId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}

		return <TreeNode title={getTreeTitle(item)} value={String(item.positionId)} key={item.positionId} />
	})

	render() {
		const { getFieldDecorator } = this.props.form
		const { staff, isEdit, checkAccount } = this.state

		return (
			<div>
				<Row type='flex' justify='center' style={{ marginTop: 20 }}>
					<Col span={12}>
						<Form onSubmit={this.handleSaveStaff}>
							<FormItem
								{...formItemLayout}
								label='员工姓名'
							>
								{getFieldDecorator('employeeName', {
									initialValue: staff.employeeName,
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '员工姓名必填'
									}, {
										whitespace: true,
										message: '员工姓名必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='员工编号'
							>
								{getFieldDecorator('employeeCode', {
									initialValue: staff.employeeCode,
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '员工编号必填'
									}, {
										whitespace: true,
										message: '员工编号必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='主要职位'
							>
								{getFieldDecorator('positionId', {
									initialValue: String(staff.positionId || ''),
									validateTrigger: 'onChange',
									rules: [{
										required: true,
										message: '主要职位必选'
									}]
								})(
									<TreeSelect
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										showSearch
										placeholder='请选择主要职位'
										allowClear
										treeNodeFilterProp='title'
									>
										{this.renderTreeNodes(this.state.positionTreeData)}
									</TreeSelect>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='邮箱'
							>
								{getFieldDecorator('email', {
									initialValue: staff.email,
									validateTrigger: 'onBlur',
									rules: [{
										type: 'email',
										message: '请输入正确的邮箱'
									}, {
										validator: this.checkEmailExisted
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='电话'
							>
								{getFieldDecorator('mobile', {
									initialValue: staff.mobile,
									validateTrigger: 'onBlur',
									rules: [
										{ required: true, message: '请输入手机号码' },
										{ pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '请输入正确的手机号码' },
										{ validator: this.checkMobileExisted }
									]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='是否有效'
							>
								{getFieldDecorator('employeeState', {
									initialValue: staff.employeeState,
									valuePropName: 'checked'
								})(
									<Checkbox />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='是否开通账号'
							>
								{getFieldDecorator('isUserAccount', {
									initialValue: staff.isUserAccount,
									valuePropName: 'checked'
								})(
									<Checkbox value={this.state.checkAccount} onChange={this.handleChange} disabled={this.state.isEdit && +staff.isUserAccount === 1} />
								)}
							</FormItem>
							{ checkAccount &&
							<div>
								<FormItem
									{...formItemLayout}
									label='用户账号'
								>
									{getFieldDecorator('loginName', {
										initialValue: staff.loginName,
										validateTrigger: 'onBlur',
										rules: [{
											required: this.state.checkAccount,
											message: '用户账号必填'
										}, {
											whitespace: true,
											message: '用户账号必填'
										}, {
											validator: this.checkAccountExist
										}]
									})(
										<Input disabled={this.state.isEdit && +staff.isUserAccount === 1} />
									)}
								</FormItem>
								<FormItem
									{...formItemLayout}
									label='初始密码'
								>
									{getFieldDecorator('loginPwd', {
										initialValue: staff.loginPwd,
										validateTrigger: 'onBlur',
										rules: [{
											required: this.state.checkAccount,
											message: '初始密码必填'
										}, {
											whitespace: true,
											message: '初始密码必填'
										}]
									})(
										<Input type='password' disabled={this.state.isEdit && +staff.isUserAccount === 1} />
									)}
								</FormItem>
							</div>
							}
							<FormItem {...tailFormItemLayout}>
								<Button type='primary' loading={this.state.loading} htmlType='submit'>保存</Button>
							</FormItem>
						</Form>
					</Col>
				</Row>
			</div>
		)
	}
}

const WrappedForm = Form.create()(CreateDepartment)

export default WrappedForm
