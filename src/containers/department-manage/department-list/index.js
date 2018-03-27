import { Table, Row, Col, Card, Tree, Spin, message } from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthBtn from 'components/auth-button'

const TreeNode = Tree.TreeNode

class DepartmentManage extends Component {
	constructor(props) {
		super(props)

		this.columns = [
			{
				title: '部门名称',
				dataIndex: 'deptName',
				width: '20%'
			}, {
				title: '上级部门',
				dataIndex: 'orgChart.fDeptName',
				width: '20%'
			}, {
				title: '部门类型',
				dataIndex: 'deptType',
				width: '15%',
				render: val => this.getDeptTypeDesc(val)
			}, {
				title: '创建时间',
				dataIndex: 'orgChart.startDt',
				width: '20%',
				render: val => val
			}, {
				title: '状态',
				dataIndex: 'isActive',
				width: '10%',
				render: val => (
					val ? <span className='helper__color_green'>启用</span> : <span className='helper__color_red'>停用</span>
				)
			}, {
				title: '操作',
				width: 200,
				dataIndex: 'deptId',
				render: val => (
					<div>
						<Link to={{
							pathname: `/app/department-manage/department-detail/${val}`,
							state: { departmentTreeData: this.state.departmentTreeData }
						}}
						>
							<AuthBtn style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.DEPT_DETAIL}>查看</AuthBtn>
						</Link>
						<AuthBtn style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.DEPT_MODIFY} onClick={() => { this.handleEditDepartment(val) }}>编辑</AuthBtn>
						<AuthBtn actionId={ACTIONIDS_CMD.DEPT_DELETE} onClick={() => { this.handleDeleteDepartment(val) }}>删除</AuthBtn>
					</div>
				)
			}
		]
	}

	state = {
		departmentTreeData: [],
		departmentListData: [],
		expandedKeys: [],
		selectedKeys: [],
		currentDeptId: '',
		isTreeLoading: false,
		isDelLoading: false,
		isTableLoading: false,
		deptTypes: []
	}

	componentWillMount() {
		const deptId = utils.getParameterByName('deptId', this.props.location.search) || ''

		this.updateDeptId(deptId)
		this.getDeptTypes()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const deptId = utils.getParameterByName('deptId', nextProps.location.search) || ''

			this.updateDeptId(deptId)
		}
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

	onLoadDepartmentListData = () => {
		this.setState({
			isTableLoading: true
		})

		request.send(HTTP_CMD.DEPT_LIST, {
			deptId: '',
			orgChart: {
				fDeptId: this.state.currentDeptId
			}
		}).then((res) => {
			this.setState({
				departmentListData: res.data,
				isTableLoading: false
			})
		}).catch(() => {
			this.setState({ isTableLoading: false })
		})
	}

	getDeptTypes() {
		helper.queryAllFields('dept_type').then((datas) => {
			this.setState({
				deptTypes: datas
			})
		})
	}

	getDeptTypeDesc = (type) => {
		if (Number.isNaN(type)) return ''

		const item = this.state.deptTypes.find(_ => +_.columnValue === +type)

		return item ? item.valueDesc : ''
	}

	getSelectedAndOpenedKeys = () => {
		let expandedKeys = []
		let selectedKeys = []

		const { departmentTreeData, currentDeptId } = this.state

		if (currentDeptId) {
			selectedKeys = [String(currentDeptId)]
			// expandedKeys = utils.getAncetoriesFromTreeData(departmentTreeData, currentDeptId, { id: 'deptId', ancestories: [], children: 'children' })
		}

		this.setState({
			selectedKeys,
			// expandedKeys
		})
	}

	handleEditDepartment = (val) => {
		const { history, match } = this.props

		history.push(`${match.url}/department-modify/${val}`, {
			isEdit: true,
			fDeptId: this.state.currentDeptId,
			departmentTreeData: this.state.departmentTreeData
		})
	}

	handleDeleteDepartment = (val) => {
		helper.confirm('确定删除当前部门？').then(() => {
			request.send(HTTP_CMD.DEL_DEPT, {
				deptId: val
			}).then(() => {
				message.success('删除成功')
				this.onLoadDepartmentListData()
				this.onLoadDepartmentTreeData()
			})
		})
	}

	handleCreateDepartment = () => {
		const { history, match } = this.props

		history.push(`${match.url}/department-create`, {
			deptId: this.state.currentDeptId,
			departmentTreeData: this.state.departmentTreeData
		})
	}

	handleSelectTreeNode = (selectedKeys, e) => {
		if (!e.selected) return

		this.setState({
			selectedKeys
		})

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
			this.onLoadDepartmentListData()
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
				<TreeNode title={item.deptName} key={item.deptId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} key={item.deptId} />
	})

	render() {
		const {
			isTreeLoading,
			isTableLoading,
			departmentListData,
			departmentTreeData,
			selectedKeys,
			expandedKeys
		} = this.state

		const treeProps = {
			selectedKeys,
			expandedKeys,
			autoExpandParent: false,
			onExpand: this.handleTreeExpand,
			onSelect: this.handleSelectTreeNode
		}

		return (
			<div>
				<Row>
					<Col span={5}>
						<Card title='部门列表' className='g_nav_tree_panel' bodyStyle={{ padding: 10 }}>
							<Spin spinning={isTreeLoading}>
								<Tree {...treeProps}>
									{this.renderTreeNodes(departmentTreeData)}
								</Tree>
							</Spin>
						</Card>
					</Col>
					<Col span={18} offset={1}>
						<Row type='flex' justify='end' style={{ marginBottom: 20 }}>
							<Col>
								<AuthBtn
									type='primary'
									actionId={ACTIONIDS_CMD.DEPT_CREATE}
									onClick={this.handleCreateDepartment}
									style={{ marginRight: 10 }}
								>
									新建
								</AuthBtn>
							</Col>
						</Row>

						<Table
							rowKey='deptId'
							loading={isTableLoading}
							columns={this.columns}
							dataSource={departmentListData}
							pagination={false}
							scroll={{ y: 600 }}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}

export default DepartmentManage
