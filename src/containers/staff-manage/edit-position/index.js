import { Row, Col, Button, Form, Input, Checkbox, Modal, message, DatePicker } from 'antd'
import React, { Component } from 'react'
import moment from 'moment'

const { RangePicker } = DatePicker
const FormItem = Form.Item

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

class EditPosition extends Component {
	state = {
		loading: false,
		employeeId: '',
		positionData: []
	}

	componentWillMount() {
		const { state } = this.props.location

		debug.dir(this.props)

		this.setState({
			positionData: state.positionData,
			employeeId: state.employeeId
		})
	}

	componentDidMount() {
		const { setFieldsValue } = this.props.form
		const { positionData } = this.state

		debug.dir(positionData)

		setFieldsValue({
			positionName: positionData.positionName,
			deptName: positionData.deptName,
			loginName: positionData.loginName,
			fPositionName: positionData.fPositionName,
			isActive: !!positionData.isActive,
			validDate: [moment(positionData.startDt), moment(positionData.endDt)]
		})
	}

	handleSavePostion = (e) => {
		e.preventDefault()

		const { validateFields } = this.props.form

		this.setState({ loading: true })

		validateFields((err, values) => {
			if (!err) {
				const params = {
					...this.state.positionData,
					isActive: values.isActive ? 1 : 0,
					startDt: values.validDate[0],
					endDt: values.validDate[1]
				}

				debug.dir(values)

				debug.log(params)

				request.send(HTTP_CMD.STAFF_MODIFY_POSITION, params).then((res) => {
					debug.dir(res)

					message.success('操作成功')
					this.setState({ loading: false })
					this.cancelModal()
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

	render() {
		const { getFieldDecorator } = this.props.form

		return (
			<Modal
				visible
				title='修改职位'
				width='600'
				maskClosable={false}
				footer={null}
				onCancel={this.cancelModal}
			>
				<Row type='flex' justify='center' style={{ marginTop: 20 }}>
					<Col span={18}>
						<Form onSubmit={this.handleSavePostion}>
							<FormItem
								{...formItemLayout}
								label='职位名称'
							>
								{getFieldDecorator('positionName')(
									<Input disabled />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='所属部门'
							>
								{getFieldDecorator('deptName')(
									<Input disabled />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='所属用户'
							>
								{getFieldDecorator('loginName')(
									<Input disabled />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='汇报对象'
							>
								{getFieldDecorator('fPositionName')(
									<Input disabled />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='是否有效'
							>
								{getFieldDecorator('isActive', {
									valuePropName: 'checked'
								})(
									<Checkbox />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='有效日期'
							>
								{getFieldDecorator('validDate', {
									validateTrigger: 'onBlur',
									rules: [{
										required: true,
										message: '请选择有效日期'
									}]
								})(
									<RangePicker showTime={{ format: 'HH:mm' }} format='YYYY-MM-DD HH:mm' />
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

const WrappedForm = Form.create()(EditPosition)

export default WrappedForm
