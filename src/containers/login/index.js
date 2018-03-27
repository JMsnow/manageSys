/**
 * Login
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Icon, Input, Button, Card, message } from 'antd'
import LogoImage from '@/assets/images/logo-red.svg'
import style from './style.scss'

const FormItem = Form.Item

class LoginForm extends Component {
	static propTypes = {
		form: PropTypes.object.isRequired
	}

	state = {
		loading: false,
		isShowPage: false
	}

	componentWillMount() {
		const { history, location: { search } } = this.props
		const fromUrl = utils.getParameterByName('from', search)

		this.checkAutoLogin()

		if (!helper.hasAuthenticated()) return

		if (fromUrl) {
			history.replace(fromUrl)
		} else {
			history.replace('/app/dashboard')
		}
	}

	getUserAuth() {
		const { history } = this.props
		request.send(HTTP_CMD.USER_AUTH, { positionId: utils.getLocalData('currentPositionId') || '' }).then((res) => {
			const allActionCodes = helper.getAllActions(res.data).map(item => item.actionCode)
			utils.setLocalData('authList', res.data)
			utils.setLocalData('allActionCodes', allActionCodes) // 存所有页面操作码
			const fromUrl = utils.getParameterByName('from')

			if (fromUrl) {
				history.replace(fromUrl)
			} else {
				history.replace('/app/dashboard')
			}
		}).catch(() => {
			this.setState({ loading: false })
		})
	}

	checkAutoLogin = () => {
		const source = utils.getParameterByName('source')
		const uid = utils.getParameterByName('uid')

		if (!source) {
			this.setState({
				isShowPage: true
			})
			return
		}

		if (source === 'erp') {
			if (/^[1-9]\d*$/.test(uid)) {
				this.requestLogin({
					contactId: uid
				})
			} else {
				message.warning('无效的UID')
				this.setState({
					isShowPage: true
				})
			}
		} else {
			message.warning('非法来源')
			this.setState({
				isShowPage: true
			})
		}
	}

	requestLogin = (values) => {
		request.send(HTTP_CMD.USER_LOGIN, { ...values, cloudId: CONFIG.cloudId }).then((res) => {
			const {
				tokenId,
				positionList = [],
				userId,
				accessToken,
				employee: { loginName }
			} = res.data
			utils.setLocalData('tokenId', tokenId)
			utils.setLocalData('loginName', loginName)

			if (positionList) {
				const currentPositionObj = (res.data.positionList || []).filter(item => item.isMainPosition === 1)[0]
				utils.setLocalData('positionList', res.data.positionList) // 存职位列表
				if (currentPositionObj) {
					utils.setLocalData('currentPositionId', currentPositionObj.positionId) // 存主职位
				}
			}

			if (userId) {
				utils.setLocalData('userid', res.data.userId)
			}

			if (accessToken) {
				utils.setLocalData(CONFIG.ACCESS_TOKEN, accessToken)
			}

			this.getUserAuth()
		}).catch(() => {
			this.setState({ loading: false })
		})
	}

	handleLoginSystem = (e) => {
		e.preventDefault()

		const { validateFields } = this.props.form

		this.setState({ loading: true })

		validateFields((err, values) => {
			if (!err) {
				this.requestLogin(values)
			}
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<div className={style.wrap} style={{ display: this.state.isShowPage ? 'block' : 'none' }}>
				<Row type='flex' justify='center' align='middle' style={{ paddingTop: 110 }}>
					<Col span={6}>
						<img src={LogoImage} alt='logo' />
						<Card title='尚品旅游分销系统' bordered={false}>
							<Form onSubmit={this.handleLoginSystem}>
								<FormItem>
									{getFieldDecorator('loginName', {
										rules: [{
											required: true,
											message: '用户名必填'
										}, {
											whitespace: true,
											message: '用户名必填'
										}]
									})(
										<Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='用户名' />
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('loginPwd', {
										rules: [{
											required: true,
											message: '密码必填'
										}, {
											whitespace: true,
											message: '密码必填'
										}]
									})(
										<Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} type='password' placeholder='密码' />
									)}
								</FormItem>
								<FormItem>
									<Button type='primary' loading={this.state.loading} htmlType='submit' style={{ width: '100%' }}>登录</Button>
								</FormItem>
							</Form>
						</Card>
					</Col>
				</Row>
			</div>
		)
	}
}

const WrappedLoginForm = Form.create()(LoginForm)

export default WrappedLoginForm
