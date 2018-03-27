import React, { Component } from 'react'
import { Form, Select, Input, Button, Row, Col, TreeSelect, message } from 'antd'

import FileUpload from 'components/file-upload'
import config from 'config/config'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const { SUPPLIERS } = config

class form extends Component {
	state = {
		imageUrl: null,
		deptTreeData: [],
		selectedPrincipal: []
	}

	componentDidMount() {
		this._loadDepartTree()
		this._loadPrincipalData()
	}

	handleSubmit = (flag) => {
		const {
			form: {
				validateFields,
				getFieldsValue
			},
			onSubmit
		} = this.props

		validateFields((errors) => {
			if (errors) {
				return
			}

			const datas = getFieldsValue()

			onSubmit(datas, flag)
		})
	}

	handleProductPrice = (price) => {
		if (!price || isNaN(price)) return ''

		const _price = parseFloat(Math.ceil(+price * 100) / 100)

		return _price.toFixed(2)
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
			product = {},
			btnLoading,
			productType: { productTypes }
		} = this.props

		const supplierKeys = Object.keys(SUPPLIERS)

		const {
			deptTreeData,
			selectedPrincipal
		} = this.state

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
			allowClear: true,
			placeholder: '请选择所属部门',
			treeNodeFilterProp: 'title'
		}

		const principleSelectProps = {
			showSearch: true,
			optionFilterProp: 'children',
			mode: 'multiple',
			placeholder: '请选择业务负责人'
		}

		return (
			<Form>
				<Row type='flex' justify='center'>
					<Col span={20}>
						<FormItem {...formItemLayout} label='产品来源'>
							{getFieldDecorator('productSource', {
								validateTrigger: 'onBlur',
								initialValue: String(product.productSource || ''),
								rules: [
									{ required: true, message: '请选择产品来源' }
								]
							})(
								<Select>
									{supplierKeys.map(k => <Option value={k} key={k}>{SUPPLIERS[k]}</Option>)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label='产品名称'>
							{
								getFieldDecorator('productName', {
									validateTrigger: 'onBlur',
									initialValue: product.productName,
									rules: [
										{ required: true, message: '请填写产品名称' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='产品副标题'>
							{
								getFieldDecorator('productSubtitle', {
									validateTrigger: 'onBlur',
									initialValue: product.productSubtitle,
									rules: [
										{ required: true, message: '请填写产品副标题' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='产品类型'>
							{
								getFieldDecorator('productType', {
									validateTrigger: 'onBlur',
									initialValue: product.productType,
									rules: [
										{ required: true, message: '请选择产品类型' }
									]
								})(
									<Select>
										{productTypes.map(type => <Option value={type.columnValue} key={type.columnValue}>{type.valueDesc}</Option>)}
									</Select>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='产品编号'>
							{
								getFieldDecorator('productCode', {
									initialValue: product.productCode,
									validateTrigger: 'onBlur',
									rules: [
										{ required: true, message: '请填写产品编号' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='产品价格'>
							{
								getFieldDecorator('productPrice', {
									validateTrigger: 'onBlur',
									initialValue: this.handleProductPrice(product.productPrice),
									rules: [
										{ required: true, message: '请填写产品价格' },
										{ pattern: /^(0|([1-9]\d{0,9}(\.\d{1,2})?))$/, message: '产品价格格式不正确' }
									]
								})(<Input />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='产品主图'>
							{
								getFieldDecorator('productImageUrl', {
									initialValue: product.productImageUrl
								})(<FileUpload />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='特色描述'>
							{
								getFieldDecorator('productDesc', {
									initialValue: product.productDesc
								})(
									<TextArea rows={4} />
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='所属组织'>
							{
								getFieldDecorator('deptIdSet', {
									initialValue: product.deptIdSet || []
								})(
									<TreeSelect {...deptTreeSelectProps}>
										{this.renderTreeNodes(deptTreeData)}
									</TreeSelect>
								)
							}
						</FormItem>
						<FormItem {...formItemLayout} label='业务负责人'>
							{
								getFieldDecorator('positionIdSet', {
									initialValue: product.positionIdSet || []
								})(
									<Select {...principleSelectProps}>
										{
											selectedPrincipal.map(
												item => <Option value={item.positionId}>{`${item.employeeName}-${item.positionName}`}</Option>
											)
										}
									</Select>
								)
							}
						</FormItem>
					</Col>
				</Row>
				<Row type='flex' justify='center' style={{ marginTop: 20 }}>
					<Col>
						<Button
							type='primary'
							key='save'
							loading={btnLoading}
							onClick={() => this.handleSubmit(1)}
							style={{ marginRight: 20 }}
						>保存</Button>
						<Button
							type='primary'
							key='saveAndConfig'
							loading={btnLoading}
							onClick={() => this.handleSubmit(2)}
						>保存并配置</Button>
					</Col>
				</Row>
			</Form>
		)
	}
}

const ProductForm = Form.create()(form)

export default ProductForm
