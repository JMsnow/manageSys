import React, { Component } from 'react'
import { DatePicker, Modal, message } from 'antd'
import moment from 'moment'

class ModifyRole extends Component {
	constructor(props) {
		super(props)
		this.state = {
			roleDetail: {},
			userDetail: {},
			dateString: [],
			isShowModal: true,
			confirmLoading: false
		}
	}
	componentWillMount() {
		const { record, userDetailData } = this.props.location.roleData
		this.setState({
			roleDetail: record,
			userDetail: userDetailData,
			dateString: [record.startDt2, record.endDt2]
		})
	}
	handleDateChange = (date, dateString) => {
		this.setState({ dateString })
	}
	handleOk = () => {
		this.setState({ confirmLoading: true })
		const reqData = {
			userId: this.state.roleDetail.userId,
			roleId: this.state.roleDetail.roleId,
			startDt2: this.state.dateString[0],
			endDt2: this.state.dateString[1]
		}
		request.send(HTTP_CMD.USER_ROLE_MODIFY, reqData).then((res) => {
			message.success(res.msg)
			this.props.onOk() // 更新父组件数据
			this.props.history.goBack()
		}).catch(() => {
			this.setState({ confirmLoading: false })
		})
	}
	handleCancel = () => {
		this.props.history.goBack()
	}
	render() {
		const { roleDetail, userDetail } = this.state
		let RangePickerDefault = []
		if (roleDetail.startDt2 && roleDetail.endDt2) {
			RangePickerDefault = [moment(roleDetail.startDt2), moment(roleDetail.endDt2)]
		}
		return (
			<Modal
				closable={false}
				visible={this.state.isShowModal}
				title='修改角色'
				confirmLoading={this.state.confirmLoading}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<div style={{ width: 300, margin: '0 auto' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>角色名称：<span>{roleDetail.roleName}</span></span>
						<span>角色描述：<span>{roleDetail.roleDesc}</span></span>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>所属用户：<span>{userDetail.loginName}</span></span>
						<span>是否有效：<span>{roleDetail.roleStatus === 1 ? '是' : '否'}</span></span>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>
							生效时间：
							<DatePicker.RangePicker
								defaultValue={RangePickerDefault}
								style={{ width: 200 }}
								onChange={this.handleDateChange}
							/>
						</span>
					</div>
				</div>
			</Modal>
		)
	}
}

export default ModifyRole
