import { Table, Modal, message, Tag, Row, Col } from 'antd'
import React, { Component } from 'react'

class AddPosition extends Component {
	constructor(props) {
		super(props)

		this.columnsPosition = [
			{
				title: '职位名称',
				dataIndex: 'positionName',
				width: 120
			}, {
				title: '职位编码',
				dataIndex: 'positionCode',
				width: 100
			}, {
				title: '职位描述',
				dataIndex: 'positionDesc',
				width: 120
			}, {
				title: '状态',
				dataIndex: 'isActive',
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
		positionListData: []
	}

	componentWillMount() {
		const { state } = this.props.location

		this.setState({
			deptId: state.deptId
		})
	}

	componentDidMount() {
		this.onLoadSelectPositionList()
	}

	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}

	onLoadSelectPositionList = () => {
		const params = {
			deptId: this.state.deptId
		}

		this.setState({ isListLoading: true })

		request.send(HTTP_CMD.DEPT_SELECT_POSITION_LIST, params).then((res) => {
			debug.dir(res)

			this.setState({
				positionListData: res.data,
				isListLoading: false
			})

			this.setState({
				selectedRowKeys: this.getSelectedPositionIds()
			})
		}).catch(() => {
			this.setState({ isListLoading: false })
		})
	}

	getPositionName = (positionId) => {
		let positionName = ''

		this.state.positionListData.forEach((item) => {
			if (item.positionId === positionId) {
				positionName = item.positionName
			}
		})

		return positionName
	}

	getSelectedPositionIds = () => {
		const { state } = this.props.location
		const arr = []

		state.positionTableData.forEach((item) => {
			arr.push(item.positionId)
		})

		return arr
	}

	cancelModal = () => {
		const { history } = this.props
		history.goBack()
	}

	handleBindPosition = (e) => {
		e.preventDefault()

		this.setState({ isBindLoading: true })

		const params = {
			deptId: this.state.deptId,
			positionIdList: this.state.selectedRowKeys
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

	renderSelectedPosition = data => data.map(id => <Tag color='green' style={{ marginBottom: 10, marginRight: 10 }}>{this.getPositionName(id)}</Tag>)

	render() {
		const { selectedRowKeys, isListLoading, isBindLoading } = this.state

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}

		return (
			<Modal
				visible
				title='添加职位'
				width='600'
				maskClosable={false}
				onCancel={this.cancelModal}
				confirmLoading={isBindLoading}
				onOk={this.handleBindPosition}
			>
				<Row style={{ marginBottom: 20 }}>
					<Col span={3}>已选择：</Col>
					<Col span={20}>{this.renderSelectedPosition(selectedRowKeys)}</Col>
				</Row>
				<Table rowSelection={rowSelection} loading={isListLoading} rowKey='positionId' columns={this.columnsPosition} dataSource={this.state.positionListData} pagination={false} scroll={{ y: 400 }} />
			</Modal>
		)
	}
}

export default AddPosition
