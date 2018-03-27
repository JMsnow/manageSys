import { Row, Col, Button, Form, Input, Checkbox, TreeSelect, Modal, message } from 'antd'
import React, { Component } from 'react'

import IconPicker from 'components/icon-picker'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const { TextArea } = Input

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

class CreateMenu extends Component {
	state = {
		loading: false,
		isEdit: false,
		menuNodeId: '',
		menuTreeData: []
	}

	componentWillMount() {
		const { state } = this.props.location

		debug.dir(this.props)

		const _menuTreeData = JSON.parse(JSON.stringify(state.menuTreeData))

		_menuTreeData.unshift({
			menuNodeName: '无',
			menuNodeId: 0
		})

		this.setState({
			isEdit: state.isEdit,
			menuTreeData: _menuTreeData,
			menuNodeId: +state.menuNodeId
		})
	}

	componentDidMount() {
		const { setFieldsValue } = this.props.form

		if (this.state.isEdit) {
			this.onLoadMenuDetail(this.state.menuNodeId)
		} else {
			setFieldsValue({
				fNodeId: this.state.menuNodeId
			})
		}
	}

	onLoadMenuDetail = (menuNodeId) => {
		const { setFieldsValue } = this.props.form

		request.send(HTTP_CMD.DETAIL_MENU, {
			menuNodeId
		}).then((res) => {
			debug.dir(res)

			setFieldsValue({
				menuNodeName: res.data.menuNodeName,
				menuNodeCode: res.data.menuNodeCode,
				functionUrl: res.data.functionUrl,
				fNodeId: res.data.fNodeId,
				functionDesc: res.data.functionDesc,
				isActive: !!res.data.isActive,
				menuIcon: res.data.menuIcon
			})
		})
	}

	handleSaveMenu = (e) => {
		e.preventDefault()

		const { validateFields } = this.props.form

		this.setState({ loading: true })

		validateFields((err, values) => {
			if (!err) {
				const params = {
					...values,
					isActive: values.isActive ? 1 : 0,
					menuNodeId: this.state.menuNodeId
				}

				debug.log(params)

				const CMD = this.state.isEdit ? HTTP_CMD.MODIFY_MENU : HTTP_CMD.ADD_MENU

				request.send(CMD, params).then((res) => {
					debug.dir(res)

					message.success('操作成功')
					this.setState({ loading: false })
					this.cancelModal()

					this.props.onLoadMenuTreeData()
				}).catch(() => {
					this.setState({ loading: false })
				})
			} else {
				this.setState({ loading: false })
			}
		})
	}

	cancelModal = () => {
		const { history } = this.props
		this.handleReset()
		history.goBack()
	}

	handleReset = () => {
		this.props.form.resetFields()
	}

	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.menuNodeName} value={item.menuNodeId} key={item.menuNodeId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.menuNodeName} value={item.menuNodeId} key={item.menuNodeId} />
	})

	render() {
		const { getFieldDecorator } = this.props.form

		return (
			<Modal
				visible
				title='菜单'
				width='600'
				maskClosable={false}
				footer={null}
				onCancel={this.cancelModal}
			>
				<Row type='flex' justify='center' style={{ marginTop: 20 }}>
					<Col span={18}>
						<Form onSubmit={this.handleSaveMenu}>
							<FormItem
								{...formItemLayout}
								label='菜单名称'
							>
								{getFieldDecorator('menuNodeName', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '菜单名称必填'
									}, {
										whitespace: true,
										message: '菜单名称必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='菜单代码'
							>
								{getFieldDecorator('menuNodeCode', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '菜单代码必填'
									}, {
										whitespace: true,
										message: '菜单代码必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='URL'
							>
								{getFieldDecorator('functionUrl', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: 'URL必填'
									}, {
										whitespace: true,
										message: 'URL必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='上级菜单'
							>
								{getFieldDecorator('fNodeId', {
									validateTrigger: 'onChange',
									rules: [{
										required: true,
										message: '上级菜单必选'
									}]
								})(
									<TreeSelect
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										showSearch
										placeholder='请选择上级菜单'
										allowClear
										treeNodeFilterProp='title'
									>
										{this.renderTreeNodes(this.state.menuTreeData)}
									</TreeSelect>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='菜单图标'
							>
								{getFieldDecorator('menuIcon')(
									<IconPicker />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='菜单描述'
							>
								{getFieldDecorator('functionDesc')(
									<TextArea rows={4} />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='是否启用'
							>
								{getFieldDecorator('isActive', {
									valuePropName: 'checked'
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
			</Modal>
		)
	}
}

const WrappedForm = Form.create()(CreateMenu)

export default WrappedForm
