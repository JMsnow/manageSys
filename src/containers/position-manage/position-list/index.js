import { Table, Row, Col, Card, Tree, Spin, message } from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthBtn from 'components/auth-button'

const TreeNode = Tree.TreeNode

class PositionList extends Component {
	constructor(props) {
		super(props)

		this.columns = [
			{
				title: '职位名称',
				dataIndex: 'positionName',
				width: '19%'
			}, {
				title: '所属部门',
				dataIndex: 'deptName',
				width: '19%'
			}, {
				title: '上级职位',
				dataIndex: 'fPositionName',
				width: '19%',
				render: val => val || '无'
			}, {
				title: '状态',
				dataIndex: 'isActive',
				width: '10%',
				render: (text) => {
					switch (text) {
					case 1 :
						return <span className='helper__color_green'>激活</span>
					case 0 :
						return <span className='helper__color_red'>停用</span>
					default :
						return ''
					}
				}
			}, {
				title: '操作',
				dataIndex: 'positionId',
				render: val => (
					<div style={{ width: 230 }}>
						<Link to={`/app/position-manage/position-detail/${val}`}>
							<AuthBtn style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.POSITION_DETAIL}>查看</AuthBtn>
						</Link>
						<AuthBtn style={{ marginRight: 10 }} onClick={() => { this.handleEditPosition(val) }} actionId={ACTIONIDS_CMD.POSITION_MODIFY}>编辑</AuthBtn>
						<AuthBtn onClick={() => { this.handleDeletePosition(val) }} actionId={ACTIONIDS_CMD.POSITION_DELETE}>删除</AuthBtn>
					</div>
				)
			}
		]
	}

	state = {
		departmentTreeData: [],
		positionListData: [],
		expandedKeys: [],
		selectedKeys: [],
		currentDeptId: '',
		isTreeLoading: false,
		isDelLoading: false,
		isTableLoading: false,
		selectedPositionIds: [],
		isBtnDisable: true // 停用激活按钮是否可用
	}

	componentWillMount() {
		const deptId = utils.getParameterByName('deptId', this.props.location.search) || ''

		this.updateDeptId(deptId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const deptId = utils.getParameterByName('deptId', nextProps.location.search) || ''

			this.updateDeptId(deptId)
		}
	}

	onLoadDepartmentTreeData = (callback) => {
		this.setState({ isTreeLoading: true })

		request.send(HTTP_CMD.DEPT_LIST_ALL).then((res) => {
			this.setState({
				departmentTreeData: helper.generateJsonTree(res.data),
				isTreeLoading: false
			})

			return typeof callback === 'function' && callback(res.data[0].deptId)
		}).catch(() => {
			this.setState({ isTreeLoading: false })
		})
	}

	onLoadPositionListData = () => {
		this.setState({
			isTableLoading: true
		})

		request.send(HTTP_CMD.POSITION_LIST, {
			deptId: this.state.currentDeptId
		}).then((res) => {
			this.setState({
				positionListData: res.data,
				isTableLoading: false
			})
		}).catch(() => {
			this.setState({ isTableLoading: false })
		})
	}

	getSelectedAndOpenedKeys = () => {
		let expandedKeys = []
		let selectedKeys = []

		const { departmentTreeData, currentDeptId } = this.state

		if (currentDeptId) {
			selectedKeys = [String(currentDeptId)]
			expandedKeys = utils.getAncetoriesFromTreeData(departmentTreeData, currentDeptId, { id: 'deptId', ancestories: [], children: 'children' })
		}

		this.setState({
			selectedKeys,
			expandedKeys
		})
	}

	handleStop = () => {
		helper.confirm('确定停用所选职位吗？').then(() => {
			request.send(HTTP_CMD.POSITION_STOP, { positionIdList: this.state.selectedPositionIds }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedPositionIds: [] })
				this.onLoadPositionListData()
			})
		})
	}

	handleActive = () => {
		helper.confirm('确定激活所选职位吗？').then(() => {
			request.send(HTTP_CMD.POSITION_ACTIVE, { positionIdList: this.state.selectedPositionIds }).then((res) => {
				message.success(res.msg)
				this.setState({ selectedPositionIds: [] })
				this.onLoadPositionListData()
			})
		})
	}

	handleEditPosition = (positionId) => {
		this.props.history.push(`${this.props.match.path}/position-modify/${positionId}`)
	}

	handleDeletePosition = (positionId) => {
		helper.confirm('确定删除该职位吗？').then(() => {
			request.send(HTTP_CMD.POSITION_DELETE, { positionId }).then((res) => {
				message.success(res.msg)
				this.onLoadPositionListData()
			})
		})
	}

	handleSelectTreeNode = (selectedKeys, e) => {
		if (!e.selected) return

		const { history, match } = this.props

		history.push(`${match.url}?deptId=${selectedKeys[0]}`)
	}

	handleTreeExpand = (expandedKeys) => {
		this.setState({
			expandedKeys
		})
	}

	handleDeptIdChange = (currentDeptId) => {
		this.setState({
			currentDeptId
		}, () => {
			this.getSelectedAndOpenedKeys(currentDeptId)
			this.onLoadPositionListData()
		})
	}

	updateDeptId = (deptId) => {
		const { departmentTreeData } = this.state

		if (departmentTreeData.length) {
			const currentDeptId = deptId

			this.handleDeptIdChange(currentDeptId)
		} else {
			this.onLoadDepartmentTreeData((_deptId) => {
				const currentDeptId = deptId || _deptId

				this.handleDeptIdChange(currentDeptId)
			})
		}
	}

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
		const {
			isTreeLoading,
			isTableLoading,
			positionListData,
			selectedPositionIds,
			selectedKeys,
			expandedKeys
		} = this.state

		const rowSelection = {
			selectedRowKeys: this.state.selectedPositionIds,
			width: '10%',
			onChange: (selectedRowKeys) => {
				this.setState({ selectedPositionIds: selectedRowKeys })
			}
		}

		const treeProps = {
			selectedKeys,
			expandedKeys,
			onExpand: this.handleTreeExpand,
			onSelect: this.handleSelectTreeNode
		}

		return (
			<div>
				<Row>
					<Col span={5}>
						<Card title='部门列表' className='g_nav_tree_panel' bodyStyle={{ padding: 10 }} >
							<Spin spinning={isTreeLoading}>
								<Tree {...treeProps}>
									{this.renderTreeNodes(this.state.departmentTreeData)}
								</Tree>
							</Spin>
						</Card>
					</Col>
					<Col span={18} offset={1}>
						<Row type='flex' justify='end' style={{ marginBottom: 20 }}>
							<Col>
								<Link to={`${this.props.match.path}/position-create`}>
									<AuthBtn
										type='primary'
										style={{ marginRight: 10 }}
										actionId={ACTIONIDS_CMD.POSITION_CREATE}
									>
										新建
									</AuthBtn>
								</Link>
								<AuthBtn
									type='primary'
									style={{ marginRight: 10 }}
									actionId={ACTIONIDS_CMD.POSITION_STOP}
									disabled={selectedPositionIds.length < 1}
									onClick={this.handleStop}
								>
									停用
								</AuthBtn>
								<AuthBtn
									type='primary'
									actionId={ACTIONIDS_CMD.POSITION_ACTIVE}
									disabled={selectedPositionIds.length < 1}
									onClick={this.handleActive}
								>
									激活
								</AuthBtn>
							</Col>
						</Row>

						<Table
							rowKey='positionId'
							rowSelection={rowSelection}
							loading={isTableLoading}
							columns={this.columns}
							dataSource={positionListData}
							pagination={false}
							scroll={{ y: 600 }}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}

export default PositionList
