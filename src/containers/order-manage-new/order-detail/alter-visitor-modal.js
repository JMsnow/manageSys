import React, { Component } from 'react'
import { Modal, Form, message, Input } from 'antd'


class modal extends Component {
	state = {
		btnLoading: false
	}
	handleSubmit = () => {
		const {
			form: {
				validateFields
			},
			record,
			onSuccess
		} = this.props

		validateFields(async (err, values) => {
			if (!err) {
				await helper.confirm('您确定要修改吗？')
				try {
					this.setState({ btnLoading: true })
					const { data } = await request.send('', {
						...values,
						orderNo: record.orderId
					})
					if (data) {
						message.success('修改成功')
						if (typeof onSuccess === 'function') {
							onSuccess({
								...record,
								...values
							})
						}
					}
				} catch (e) {
					message.error('修改失败')
					this.setState({ btnLoading: false })
				}
			}
		})
	}
	render() {
		const {
			form: { getFieldDecorator },
			record
		} = this.props
		const {
			btnLoading
		} = this.state

		const modalProps = {
			title: '修改',
			visible: true,
			confirmLoading: btnLoading,
			onOk: this.handleSubmit,
			onCancel: this.props.destroy
		}

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 12
			},
			colon: false
		}

		return (
			<Modal {...modalProps}>
				<Form>
					<Form.Item {...formItemLayout} label="姓名">
						{
							getFieldDecorator('name', {
								rules: [{ required: true, message: '请输入姓名' }],
								initialValue: record.name
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item {...formItemLayout} label="电话">
						{
							getFieldDecorator('phone', {
								rules: [{ required: true, message: '请输入电话' }],
								initialValue: record.phone
							})(
								<Input />
							)
						}
					</Form.Item>
					<Form.Item {...formItemLayout} label="身份证">
						{
							getFieldDecorator('lincese', {
								rules: [{ required: true, message: '请输入身份证' }],
								initialValue: record.lincese
							})(
								<Input />
							)
						}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
}

export default Form.create()(modal)
