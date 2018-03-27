import { Row, Col, Button, Form, Input, Checkbox, TreeSelect, message, Select } from 'antd'
import React, { Component } from 'react'

import GoBack from 'components/go-back'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const Option = Select.Option

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
		deptId: '',
		fDeptId: '',
		deptTreeData: [],
		deptTypes: [],
		citys: [],
		isCompany: false
	}

	componentWillMount() {
		const { state } = this.props.location
		const { params } = this.props.match

		this.setState({
			isEdit: state.isEdit,
			deptTreeData: state.departmentTreeData,
			deptId: state.isEdit ? +params.id : +state.deptId,
			fDeptId: +state.fDeptId
		})
	}

	componentDidMount() {
		const { setFieldsValue } = this.props.form

		if (this.state.isEdit) {
			this.onLoadDepartmentDetail(this.state.deptId)
		} else {
			setFieldsValue({
				deptId: this.state.deptId
			})
		}

		this.getDeptTypes()
		this.getCitys()
	}

	onLoadDepartmentDetail = (deptId) => {
		const { setFieldsValue } = this.props.form

		request.send(HTTP_CMD.DEPT_DETAIL, {
			deptId
		}).then((res) => {
			debug.dir(res)

			setFieldsValue({
				deptName: res.data.deptName,
				deptCode: res.data.deptCode,
				deptId: this.state.fDeptId,
				deptType: res.data.deptType,
				isActive: !!res.data.isActive,
				isCompany: !!res.data.isCompany,
				isOrg: !!res.data.isOrg
			})

			this.setState({
				isCompany: !!res.data.isCompany
			})
		})
	}

	getDeptTypes() {
		helper.queryAllFields('dept_type').then((datas) => {
			this.setState({
				deptTypes: datas
			})
		})
	}

	getCitys() {
		helper.queryAllFields('city_no').then((datas) => {
			this.setState({
				citys: datas
			})
		})
	}

	handleSaveDepartment = (e) => {
		e.preventDefault()

		const { validateFields } = this.props.form

		this.setState({ loading: true })

		validateFields((err, values) => {
			if (!err) {
				const params = {
					...values,
					isActive: values.isActive ? 1 : 0,
					isOrg: values.isOrg ? 1 : 0,
					isCompany: values.isCompany ? 1 : 0,
					deptId: this.state.deptId,
					orgChart: {
						fDeptId: values.deptId
					}
				}

				debug.log(params)

				const CMD = this.state.isEdit ? HTTP_CMD.MODIFY_DEPT : HTTP_CMD.CREATE_DEPT

				request.send(CMD, params).then((res) => {
					debug.dir(res)

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

	handleIsCompanyChange = (e) => {
		this.setState({
			isCompany: e.target.checked
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
		const { getFieldDecorator } = this.props.form
		const { history } = this.props
		const { deptTypes, isCompany, citys } = this.state

		return (
			<div>
				<Row style={{ marginBottom: 20 }}>
					<Col>
						<GoBack history={history} />
					</Col>
				</Row>

				<Row type='flex' justify='center' style={{ marginTop: 20 }}>
					<Col span={12}>
						<Form onSubmit={this.handleSaveDepartment}>
							<FormItem
								{...formItemLayout}
								label='部门名称'
							>
								{getFieldDecorator('deptName', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '部门名称必填'
									}, {
										whitespace: true,
										message: '部门名称必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='部门代码'
							>
								{getFieldDecorator('deptCode', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '部门代码必填'
									}, {
										whitespace: true,
										message: '部门代码必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							{<FormItem
								{...formItemLayout}
								label='所属部门'
							>
								{getFieldDecorator('deptId', {
									validateTrigger: 'onChange',
									rules: [{
										required: true,
										message: '所属部门必选'
									}]
								})(
									<TreeSelect
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										showSearch
										placeholder='请选择所属部门'
										allowClear
										treeNodeFilterProp='title'
									>
										{this.renderTreeNodes(this.state.deptTreeData)}
									</TreeSelect>
								)}
							</FormItem>
							}
							{!isCompany && <FormItem
								{...formItemLayout}
								label='部门类型'
							>
								{getFieldDecorator('deptType', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '请选择部门类型'
									}]
								})(
									<Select>
										{deptTypes.map(type => <Option value={type.columnValue} key={type.columnValue}>{type.valueDesc}</Option>)}
									</Select>
								)}
							</FormItem>}
							{isCompany && <FormItem
								{...formItemLayout}
								label='所属城市'
							>
								{getFieldDecorator('city_no', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '请选择所属城市'
									}]
								})(
									<Select>
										{citys.map(type => <Option value={type.columnValue} key={type.columnValue}>{type.valueDesc}</Option>)}
									</Select>
								)}
							</FormItem>}
							<FormItem
								{...formItemLayout}
								label='是否组织'
							>
								{getFieldDecorator('isOrg', {
									valuePropName: 'checked'
								})(
									<Checkbox />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='是否公司'
							>
								{getFieldDecorator('isCompany', {
									valuePropName: 'checked'
								})(
									<Checkbox onChange={this.handleIsCompanyChange} />
								)}
							</FormItem>
							{/* <FormItem
								{...formItemLayout}
								label='是否销售部门'
							>
								{getFieldDecorator('deptType', {
									valuePropName: 'checked'
								})(
									<Checkbox />
								)}
							</FormItem> */}
							<FormItem
								{...formItemLayout}
								label='是否有效'
							>
								{getFieldDecorator('isActive', {
									valuePropName: 'checked',
									initialValue: true
								})(
									<Checkbox />
								)}
							</FormItem>
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
