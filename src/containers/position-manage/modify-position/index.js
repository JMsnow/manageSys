import React, { Component } from 'react'
import { DatePicker, Modal, message } from 'antd'
import moment from 'moment'

class ModifyPositionRole extends Component {
	constructor(props) {
		super(props)
		this.state = {
			roleRecord: {},
			positionDetail: {},
			dateString: [],
			isShowModal: true,
			confirmLoading: false
		}
	}
	componentWillMount() {
		const { roleRecord, positionDetail } = this.props.location
		this.setState({
			roleRecord,
			positionDetail,
			dateString: [roleRecord.startDt, roleRecord.endDt]
		})
	}
	handleDateChange = (date, dateString) => {
		this.setState({ dateString })
	}
	handleOk = () => {
		if (this.state.dateString.length < 2) {
			return
		}
		this.setState({ confirmLoading: true })
		const reqData = {
			positionId: this.state.positionDetail.positionId,
			roleId: this.state.roleRecord.roleId,
			startDt: this.state.dateString[0],
			endDt: this.state.dateString[1]
		}
		request.send(HTTP_CMD.POSITION_ROLE_Modify, reqData).then((res) => {
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
		const { roleRecord, positionDetail } = this.state
		let RangePickerDefault = []
		if (roleRecord.startDt && roleRecord.endDt) {
			RangePickerDefault = [moment(roleRecord.startDt), moment(roleRecord.endDt)]
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
						<span>角色名称：<span>{roleRecord.roleName}</span></span>
						<span>角色描述：<span>{roleRecord.roleDesc}</span></span>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>所属职位：<span>{positionDetail.positionName}</span></span>
						<span>是否有效：<span>{roleRecord.roleStatus === 1 ? '是' : '否'}</span></span>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>
							生效时间：
							<DatePicker.RangePicker
								style={{ width: 200 }}
								onChange={this.handleDateChange}
								defaultValue={RangePickerDefault}
							/>
						</span>
					</div>
				</div>
			</Modal>
		)
	}
}

export default ModifyPositionRole
