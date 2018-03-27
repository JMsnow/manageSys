import { Table, Modal, message, Tag, Row, Col } from 'antd'
import React, { Component } from 'react'

class AddEmployee extends Component {
	constructor(props) {
		super(props)

		this.columnsEmployee = [
			{
				title: '员工名称',
				dataIndex: 'employeeName',
				width: 120
			}, {
				title: '员工编码',
				dataIndex: 'employeeCode',
				width: 100
			}, {
				title: '状态',
				dataIndex: 'employeeState',
				width: 50,
				render: val => (
					val ? <span className='helper__color_green'>启用</span> : <span className='helper__color_red'>停用</span>
				)
			}
		]
	}

	state = {
		deptId: '',
		isListLoading: false,
		isBindLoading: false,
		selectedRowKeys: [],
		employeeListData: []
	}

	componentWillMount() {
		const { state } = this.props.location

		this.setState({
			deptId: state.deptId
		})
	}

	componentDidMount() {
		this.onLoadSelectEmployeeList()
	}

	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}

	onLoadSelectEmployeeList = () => {
		const params = {
			deptId: this.state.deptId
		}

		this.setState({ isListLoading: true })

		request.send(HTTP_CMD.DEPT_SELECT_EMPLOYEE_LIST, params).then((res) => {
			debug.dir(res)

			this.setState({
				employeeListData: res.data,
				isListLoading: false
			})

			this.setState({
				selectedRowKeys: this.getSelectedEmployeeIds()
			})
		}).catch(() => {
			this.setState({ isListLoading: false })
		})
	}

	getEmployeeName = (employeeId) => {
		let employeeName = ''

		this.state.employeeListData.forEach((item) => {
			if (item.employeeId === employeeId) {
				employeeName = item.employeeName
			}
		})

		return employeeName
	}

	getSelectedEmployeeIds = () => {
		const { state } = this.props.location
		const arr = []

		state.employeeTableData.forEach((item) => {
			arr.push(item.employeeId)
		})

		return arr
	}

	cancelModal = () => {
		const { history } = this.props
		history.goBack()
	}

	handleBindEmployee = (e) => {
		e.preventDefault()

		this.setState({ isBindLoading: true })

		const params = {
			deptId: this.state.deptId,
			employeeIdList: this.state.selectedRowKeys
		}

		request.send(HTTP_CMD.DEPT_BIND_POSITION, params).then((res) => {
			debug.dir(res)

			this.setState({
				isBindLoading: false
			})

			this.cancelModal()
			this.props.onLoadDepartmentDetail()
			message.success('添加成功')
		}).catch(() => {
			this.setState({ isBindLoading: false })
		})
	}

	renderSelectedEmployee = data => data.map(id => <Tag color='green' style={{ marginBottom: 10, marginRight: 10 }}>{this.getEmployeeName(id)}</Tag>)

	render() {
		const { selectedRowKeys, isListLoading, isBindLoading } = this.state

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}

		return (
			<Modal
				visible
				title='添加员工'
				width='600'
				maskClosable={false}
				onCancel={this.cancelModal}
				confirmLoading={isBindLoading}
				onOk={this.handleBindEmployee}
			>
				<Row style={{ marginBottom: 20 }}>
					<Col span={3}>已选择：</Col>
					<Col span={20}>{this.renderSelectedEmployee(selectedRowKeys)}</Col>
				</Row>
				<Table rowSelection={rowSelection} loading={isListLoading} rowKey='employeeId' columns={this.columnsEmployee} dataSource={this.state.employeeListData} pagination={false} scroll={{ y: 400 }} />
			</Modal>
		)
	}
}

export default AddEmployee
