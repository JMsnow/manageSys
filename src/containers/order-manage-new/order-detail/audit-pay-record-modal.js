import React, { Component } from 'react'
import { Modal, Form, message, Input, Card, Row, Col, Button } from 'antd'
import UploadPicturesWall from 'components/upload-pictures-wall'

import style from './style.scss'

class modal extends Component {
	state = {
		passLoading: false,
		refuseLoading: false
	}
	onSubmit = async (pass) => {
		const {
			form: {
				validateFields
			},
			id,
			record,
			onSuccess
		} = this.props

		validateFields(async (err, values) => {
			if (!err) {
				const opts = pass ? {
					text: '通过',
					loading: 'passLoading'
				} : {
					text: '拒绝',
					loading: 'refuseLoading'
				}
				await helper.confirm(`您确定要${opts.text}吗？`)
				try {
					this.setState({ [opts.loading]: true })
					const { data } = await request.send('/orderOffLine/acceptCheckOrderOffLine', {
						orderNo: id,
						payId: record.payId,
						auditDesc: values.auditDesc,
						fStatus: pass ? '2' : '1'
					})
					if (data) {
						message.success(`${opts.text}成功`)
						if (typeof onSuccess === 'function') {
							onSuccess()
						}
					}
				} catch (e) {
					message.error(`${opts.text}失败`)
					this.setState({ [opts.loading]: false })
				}
			}
		})
	}
	isAffirm () {
		const { record } = this.props
		return (+record.fStatus) !== 0 || !record.hasOwnProperty('fStatus')
	}
	getUrls() {
		const { record } = this.props
		return (record.url ? record.url.split(',') : []).map(url => ({ url }))
	}
	getAuditDesc() {
		const { record } = this.props
		return this.isAffirm() ? (
			<Card title={'处理说明'} style={{ marginTop: 20 }}>
				<Row>
					<Col span={24}>
						{record.auditDesc}
					</Col>
				</Row>
			</Card>
		) : (
			<Card title={'填写处理说明（200字内）：'} style={{ marginTop: 20 }}>
				<Row>
					<Col span={24}>
						<Form.Item {...formItemLayout} label="">
							{
								getFieldDecorator('auditDesc', {
									rules: [{ required: true, message: '请填写处理说明' }],
									initialValue: ''
								})(
									<Input.TextArea placeholder="请输入" autosize={{ minRows: 4, maxRows: 6 }} />
								)
							}
						</Form.Item>
					</Col>>
				</Row>
			</Card>
		)
	}
	render() {
		const {
			form: { getFieldDecorator },
			orderInfo,
			record
		} = this.props
		const {
			passLoading,
			refuseLoading
		} = this.state

		const modalProps = {
			title: '审核凭证',
			visible: true,
			width: 1000,
			onCancel: this.props.destroy,
			footer: this.isAffirm() ? null : (
				<React.Fragment>
					<Button type="danger" loading={passLoading} onClick={() => this.onSubmit(true)}>
						通过
					</Button>
					<Button type="danger" loading={refuseLoading} onClick={() => this.onSubmit()}>
						拒绝
					</Button>
				</React.Fragment>
			)
		}

		const formItemFullLayout = {
			wrapperCol: {
				span: 24
			}
		}

		return (
			<Modal {...modalProps}>
				<Form>
					<Card>
						<Row>
							<Col span={24}>
								待支付金额：<span className={style.text_grey}>{orderInfo.otoPay}</span>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								本次凭证金额：<span className={style.text_grey}>{record.money}</span>
							</Col>
						</Row>
					</Card>
					<Card title={'申请说明'} style={{ marginTop: 20 }}>
						<Row>
							<Col span={24}>
								{record.uploadDesc}
							</Col>
						</Row>
					</Card>
					<Card title={'凭证'} style={{ marginTop: 20 }}>
						<Row>
							<Col span={24}>
								<Form.Item {...formItemFullLayout} label="">
									{
										getFieldDecorator('pics', {
											initialValue: this.getUrls()
										})(
											<UploadPicturesWall onlyDisplay />
										)
									}
								</Form.Item>
							</Col>
						</Row>
					</Card>
					{this.getAuditDesc()}
				</Form>
			</Modal>
		)
	}
}

export default Form.create()(modal)
