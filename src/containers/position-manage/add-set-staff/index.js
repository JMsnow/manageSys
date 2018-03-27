import React from 'react'
import { Input, Table, Tag, Modal } from 'antd'

class AddStaff extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedRowKeys: [],
			selectedRows: [],
			staffs: [], // 表格数据
			initStaffs: [],
			isShowModal: true,
			confirmLoading: false
		}
	}
	componentWillMount() {
		debug.log(this.props)
		this._getStaffs('')
	}
	_getStaffs = (value, isSearch) => {
		const url = HTTP_CMD.POSITION_SELECT_STAFF
		const params = {
			positionId: this.props.location.positionDetailData.positionId,
			employeeName: value
		}
		request.send(url, params).then((res) => {
			const defaultKeys = []
			const defaultRows = []
			if (isSearch) {
				this.setState({ tableLoading: false, staffs: res.data })
				return
			}
			res.data.forEach((item) => {
				if (item.select) {
					defaultKeys.push(item.employeeId)
					defaultRows.push(item)
				}
			})
			this.setState({
				staffs: res.data,
				initStaffs: res.data,
				selectedRowKeys: defaultKeys,
				selectedRows: defaultRows
			})
		})
	}
	handleSearch = (value) => {
		this._getStaffs(value, true)
	}
	handleOk = () => {
		this.props.onOk(this.state.selectedRowKeys, this) // 更新父组件数据
	}
	handleCancel = () => {
		this.props.history.goBack()
	}
	render() {
		const self = this
		const columns = [
			{
				title: '员工名称',
				dataIndex: 'employeeName',
				width: '30%'
			},
			{
				title: '员工编号',
				dataIndex: 'employeeCode',
				width: '30%'
			},
			{
				title: '员工状态',
				dataIndex: 'employeeState',
				width: '40%',
				render: (text) => {
					if (text === 1) {
						return '激活'
					}
					if (text === 0) {
						return '停用'
					}
					return ''
				}
			}
		]
		const rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys,
			onChange(selectedRowKeys) {
				self.setState({
					selectedRowKeys,
					selectedRows: self.state.initStaffs.filter(item => selectedRowKeys.indexOf(item.employeeId) > -1)
				})
			}
		}
		return (
			<Modal
				closable={false}
				visible={this.state.isShowModal}
				title='选择员工'
				confirmLoading={this.state.confirmLoading}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<div>
					<div style={{ textAlign: 'right' }}>
						<Input.Search placeholder='搜索员工' style={{ width: 200 }} onSearch={this.handleSearch} />
					</div>
					<div style={{ display: 'flex', marginTop: 10 }}>
						<span style={{ flex: '0 0 60px' }}>已选择：</span>
						<div>
							{this.state.selectedRows.map(item => <Tag color='green'>{item.employeeName}</Tag>)}
						</div>
					</div>
					<div style={{ marginTop: 20 }}>
						<Table
							rowKey='employeeId'
							columns={columns}
							dataSource={this.state.staffs}
							rowSelection={rowSelection}
							pagination={false}
							scroll={{ y: 300 }}
						/>
					</div>
				</div>
			</Modal>
		)
	}
}

export default AddStaff
