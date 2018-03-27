import React, { Component } from 'react'
import { DatePicker, Modal, message } from 'antd'
import moment from 'moment'

class PositionModifyStaff extends Component {
	constructor(props) {
		super(props)
		this.state = {
			staffRecord: {},
			positionDetail: {},
			dateString: [],
			isShowModal: true,
			confirmLoading: false
		}
	}
	componentWillMount() {
		const { staffRecord, positionDetail } = this.props.location
		this.setState({
			staffRecord,
			positionDetail,
			dateString: [staffRecord.startDt, staffRecord.endDt]
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
			employeeId: this.state.staffRecord.employeeId,
			startDt: this.state.dateString[0],
			endDt: this.state.dateString[1]
		}
		request.send(HTTP_CMD.POSITION_STAFF_MODIFY, reqData).then((res) => {
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
		const { staffRecord, positionDetail } = this.state
		let RangePickerDefault = []
		if (staffRecord.startDt && staffRecord.endDt) {
			RangePickerDefault = [moment(staffRecord.startDt), moment(staffRecord.endDt)]
		}
		return (
			<Modal
				closable={false}
				visible={this.state.isShowModal}
				title='修改员工'
				confirmLoading={this.state.confirmLoading}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<div style={{ width: 300, margin: '0 auto' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>员工名称：<span>{staffRecord.employeeName}</span></span>
						<span>员工代码：<span>{staffRecord.employeeCode}</span></span>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
						<span>所属职位：<span>{positionDetail.positionName}</span></span>
						<span>是否有效：<span>{staffRecord.employeeState === 1 ? '是' : '否'}</span></span>
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

export default PositionModifyStaff
