import { Table, Modal, message, Tag, Row, Tree, Col, Spin, Card } from 'antd'
import React, { Component } from 'react'

const TreeNode = Tree.TreeNode

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
		employeeId: '',
		mainPositionId: '',
		deptId: '',
		isListLoading: false,
		isTreeLoading: false,
		isBindLoading: false,
		selectedRowKeys: [],
		departmentTreeData: [],
		positionListData: [],
		topPositionTableData: []
	}

	componentWillMount() {
		const { state } = this.props.location

		this.setState({
			employeeId: state.employeeId,
			mainPositionId: state.mainPositionId,
			topPositionTableData: state.positionTableData
		})
	}

	componentDidMount() {
		this.onLoadDepartmentTreeData((id) => {
			// 默认选中第一个树节点
			this.setState({
				deptId: id
			})

			this.onLoadSelectPositionList()
		})
	}

	onLoadDepartmentTreeData = (callback) => {
		this.setState({ isTreeLoading: true })

		request.send(HTTP_CMD.DEPT_LIST_ALL_WITH).then((res) => {
			this.setState({
				departmentTreeData: helper.generateJsonTree(res.data),
				isTreeLoading: false
			})

			return typeof callback === 'function' && callback(res.data[0].deptId)
		}).catch(() => {
			this.setState({ isTreeLoading: false })
		})
	}

	onLoadSelectPositionList = () => {
		const params = {
			employeeId: this.state.employeeId,
			deptId: this.state.deptId
		}

		this.setState({ isListLoading: true })

		request.send(HTTP_CMD.STAFF_SELECT_POSITION_LIST, params).then((res) => {
			debug.dir(res)

			this.setState({
				positionListData: res.data,
				isListLoading: false
			})

			this.setState({
				selectedRowKeys: utils.unique(this.state.selectedRowKeys.concat(this.getSelectedPositionId()))
			})
		}).catch(() => {
			this.setState({ isListLoading: false })
		})
	}

	onSelectChange = (selectedRowKeys) => {
		debug.dir(selectedRowKeys)
		this.setState({ selectedRowKeys })
	}

	getPositionName = (positionId) => {
		const { topPositionTableData } = this.state
		let positionName = ''

		topPositionTableData.forEach((item) => {
			if (item.positionId === positionId) {
				positionName = item.positionName
			}
		})

		return positionName
	}

	getSelectedPositionId = () => {
		const { topPositionTableData } = this.state
		const arr = []

		topPositionTableData.forEach((item) => {
			arr.push(item.positionId)
		})

		return arr
	}

	cancelModal = () => {
		const { history } = this.props
		history.goBack()
	}

	handleSelectTreeNode = (selectedKeys, e) => {
		if (!e.selected) return

		this.setState({
			deptId: selectedKeys[0]
		})

		setTimeout(() => {
			this.onLoadSelectPositionList()
		}, 0)
	}

	handleBindPosition = (e) => {
		e.preventDefault()

		this.setState({ isBindLoading: true })

		const params = {
			employeeId: this.state.employeeId,
			positionIdList: this.state.selectedRowKeys
		}

		request.send(HTTP_CMD.STAFF_BIND_POSITION, params).then((res) => {
			debug.dir(res)

			this.setState({
				isBindLoading: false
			})

			this.cancelModal()
			this.props.onLoadStaffDetail()
			message.success('添加成功')
		}).catch(() => {
			this.setState({ isBindLoading: false })
		})
	}

	renderSelectedPosition = data => data.map(id => <Tag color='green' style={{ marginBottom: 10, marginRight: 10 }}>{this.getPositionName(id)}</Tag>)

	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.deptName} key={item.deptId} dataRef={item}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} key={item.deptId} dataRef={item} />
	})

	render() {
		const { selectedRowKeys, isListLoading, isBindLoading, isTreeLoading, mainPositionId } = this.state

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
			getCheckboxProps: record => ({
				disabled: record.positionId === mainPositionId
			})
		}

		return (
			<Modal
				visible
				title='添加职位'
				width='900'
				maskClosable={false}
				onCancel={this.cancelModal}
				confirmLoading={isBindLoading}
				onOk={this.handleBindPosition}
			>
				{/* <Row style={{ marginBottom: 20 }}>
					<Col span={2}>已选择：</Col>
					<Col span={22}>{this.renderSelectedPosition(selectedRowKeys)}</Col>
				</Row> */}
				<Row type='flex' justify='space-between' style={{ marginBottom: 20 }}>
					<Col span={6}>
						<Card title='部门列表'>
							<Spin spinning={isTreeLoading}>
								<Tree onSelect={this.handleSelectTreeNode}>
									{this.renderTreeNodes(this.state.departmentTreeData)}
								</Tree>
							</Spin>
						</Card>
					</Col>
					<Col span={17}>
						<Table rowSelection={rowSelection} loading={isListLoading} rowKey='positionId' columns={this.columnsPosition} dataSource={this.state.positionListData} pagination={false} scroll={{ y: 400 }} />
					</Col>
				</Row>
			</Modal>
		)
	}
}

export default AddPosition
