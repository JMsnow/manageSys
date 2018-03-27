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

class CreateFeature extends Component {
	state = {
		loading: false,
		isEdit: false,
		actionId: '',
		menuNodeId: '',
		menuTreeData: []
	}

	componentWillMount() {
		const { state } = this.props.location
		this.setState({
			isEdit: state.isEdit,
			menuTreeData: state.menuTreeData,
			actionId: +state.actionId,
			menuNodeId: +state.menuNodeId
		})
	}

	componentDidMount() {
		const { setFieldsValue } = this.props.form
		if (this.state.isEdit) {
			this.onLoadActionDetail(this.state.menuNodeId, this.state.actionId)
		} else {
			setFieldsValue({
				menuNodeId: this.state.menuNodeId
			})
		}
	}

	onLoadActionDetail = (menuNodeId, actionId) => {
		const { setFieldsValue } = this.props.form

		request.send(HTTP_CMD.DETAIL_ACTION, {
			menuNodeId,
			actionId
		}).then((res) => {
			debug.dir(res)

			setFieldsValue({
				actionName: res.data.actionName,
				actionCode: res.data.actionCode,
				actionUrl: res.data.actionUrl,
				menuNodeId: res.data.menuNodeId,
				actionDesc: res.data.actionDesc,
				isActive: !!res.data.isActive,
				menuIcon: res.data.menuIcon
			})
		})
	}

	handleSaveAction = (e) => {
		e.preventDefault()

		const { validateFields } = this.props.form

		this.setState({ loading: true })

		validateFields((err, values) => {
			if (!err) {
				const params = {
					...values,
					isActive: values.isActive ? 1 : 0,
					actionType: 'Button',
					actionId: this.state.actionId
				}

				debug.log(params)

				const CMD = this.state.isEdit ? HTTP_CMD.MODIFY_ACTION : HTTP_CMD.ADD_ACTION

				request.send(CMD, params).then((res) => {
					debug.dir(res)

					message.success('操作成功')
					this.setState({ loading: false })
					this.cancelModal()

					this.props.onLoadActionListData()
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
				title='功能'
				width='600'
				maskClosable={false}
				footer={null}
				onCancel={this.cancelModal}
			>
				<Row type='flex' justify='center' style={{ marginTop: 20 }}>
					<Col span={18}>
						<Form onSubmit={this.handleSaveAction}>
							<FormItem
								{...formItemLayout}
								label='功能名称'
							>
								{getFieldDecorator('actionName', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '功能名称必填'
									}, {
										whitespace: true,
										message: '功能名称必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='功能代码'
							>
								{getFieldDecorator('actionCode', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '功能代码必填'
									}, {
										whitespace: true,
										message: '功能代码必填'
									}]
								})(
									<Input />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='URL'
							>
								{getFieldDecorator('actionUrl', {
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
								label='所属菜单'
							>
								{getFieldDecorator('menuNodeId', {
									validateTrigger: 'onChange',
									rules: [{
										required: true,
										message: '所属菜单必选'
									}]
								})(
									<TreeSelect
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										showSearch
										placeholder='请选择所属菜单'
										allowClear
										treeNodeFilterProp='title'
									>
										{this.renderTreeNodes(this.state.menuTreeData)}
									</TreeSelect>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='功能图标'
							>
								{getFieldDecorator('menuIcon')(
									<IconPicker />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='功能描述'
							>
								{getFieldDecorator('actionDesc')(
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

const WrappedForm = Form.create()(CreateFeature)

export default WrappedForm
