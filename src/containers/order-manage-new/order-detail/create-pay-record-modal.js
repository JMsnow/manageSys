import React, { Component } from 'react'
import { Modal, Form, message, Input, Card, Row, Col, InputNumber } from 'antd'
import UploadPicturesWall from 'components/upload-pictures-wall'

import style from './style.scss'

class modal extends Component {
	state = {
		btnLoading: false
	}
	onSubmit = () => {
		const {
			form: {
				validateFields
			},
			id,
			onSuccess
		} = this.props

		validateFields(async (err, values) => {
			if (!err) {
				if (+values.money !== +values.confirmMoney) {
					message.error('两次凭证金额不一致')
					return
				} else if (values.pics.length < 1) {
					message.error('请上传至少一张凭证')
					return
				}
				await helper.confirm('您确定要提交审核吗？')
				try {
					this.setState({ btnLoading: true })
					const { data } = await request.send('/orderOffLine/acceptAddOrderOffLine', {
						orderNo: id,
						url: values.pics.map(v => v.url).join(','),
						money: values.money,
						uploadDesc: values.uploadDesc
					})
					if (data) {
						message.success('提交成功')
						if (typeof onSuccess === 'function') {
							onSuccess()
						}
					}
				} catch (e) {
					message.error('提交失败')
					this.setState({ btnLoading: false })
				}
			}
		})
	}
	render() {
		const {
			form: { getFieldDecorator },
			orderInfo
		} = this.props
		const {
			btnLoading
		} = this.state

		const modalProps = {
			title: '创建凭证',
			visible: true,
			width: 1000,
			confirmLoading: btnLoading,
			okText: '提交审核',
			onOk: this.onSubmit,
			onCancel: this.props.destroy
		}

		const formItemLayout = {
			labelCol: {
				span: 12
			},
			wrapperCol: {
				span: 12
			},
			colon: true
		}
		const formItemFullLayout = {
			wrapperCol: {
				span: 24
			}
		}

		return (
			<Modal {...modalProps}>
				<Form>
					<Card title={<React.Fragment>待支付金额：<span className={style.text_grey}>{orderInfo.otoPay}</span></React.Fragment>}>
						<Row type="flex">
							<Col>
								<Form.Item {...formItemLayout} label='输入凭证金额'>
									{
										getFieldDecorator('money', {
											rules: [{ required: true, message: '请输入' }],
											initialValue: 0
										})(
											<InputNumber min={0} style={{ width: 100}} />
										)
									}
								</Form.Item>
							</Col>
							<Col style={{ paddingTop: 10 }}>
								<span className={style.text_red}>*请确保输入金额与凭证金额相符</span>
							</Col>
						</Row>
						<Row type="flex">
							<Col>
								<Form.Item {...formItemLayout} label='确认凭证金额'>
									{
										getFieldDecorator('confirmMoney', {
											rules: [{ required: true, message: '请输入' }],
											initialValue: 0
										})(
											<InputNumber min={0} style={{ width: 100}} />
										)
									}
								</Form.Item>
							</Col>
							<Col style={{ paddingTop: 10 }}>
								<span className={style.text_red}>*请确保输入金额与凭证金额相符</span>
							</Col>
						</Row>
					</Card>
					<Card title={'填写申请说明（200字内）：'} style={{ marginTop: 20 }}>
						<Row>
							<Col span={24}>
								<Form.Item {...formItemFullLayout} label="">
									{
										getFieldDecorator('uploadDesc', {
											rules: [{ required: true, message: '请填写申请说明' }],
											initialValue: ''
										})(
											<Input.TextArea placeholder="请输入" autosize={{ minRows: 4, maxRows: 6 }} />
										)
									}
								</Form.Item>
							</Col>
						</Row>
					</Card>
					<Card title={'添加凭证（可选择多张）'} style={{ marginTop: 20 }}>
						<Row>
							<Col span={24}>
								<Form.Item {...formItemFullLayout} label="">
									{
										getFieldDecorator('pics', {
											rules: [{ required: true, message: '请添加凭证' }],
											initialValue: []
										})(
											<UploadPicturesWall action={'/orderOffLine/uploadImg'} />
										)
									}
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Form>
			</Modal>
		)
	}
}

export default Form.create()(modal)
