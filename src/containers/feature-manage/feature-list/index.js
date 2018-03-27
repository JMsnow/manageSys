import { Table, Row, Col, Card, Tree, Spin, message } from 'antd'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AuthBtn from 'components/auth-button'

import CreateFeature from 'containers/feature-manage/create-feature'
import CreateMenu from 'containers/feature-manage/create-menu'

const TreeNode = Tree.TreeNode

class FeatureManage extends Component {
	constructor(props) {
		super(props)

		this.columns = [
			{
				title: '功能名称',
				dataIndex: 'actionName',
				width: '16%'
			}, {
				title: '功能代码',
				dataIndex: 'actionCode',
				width: '12%'
			}, {
				title: '功能描述',
				dataIndex: 'actionDesc',
				width: '16%'
			}, {
				title: 'URL',
				dataIndex: 'actionUrl',
				width: '16%'
			}, {
				title: '状态',
				dataIndex: 'isActive',
				width: '12%',
				render: val => (
					val ? <span className='helper__color_green'>启用</span> : <span className='helper__color_red'>停用</span>
				)
			}, {
				title: '操作',
				dataIndex: 'actionId',
				width: '22%',
				render: val => (
					<div style={{ width: 140 }}>
						<AuthBtn onClick={() => { this.handleEditAction(val) }} style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.FUN_MODIFY} >编辑</AuthBtn>
						<AuthBtn onClick={() => { this.handleDeleteAction(val) }} actionId={ACTIONIDS_CMD.FUN_DELETE} >删除</AuthBtn>
					</div>
				)
			}
		]
	}

	state = {
		menuTreeData: [],
		actionListData: [],
		selectedRowKeys: [],
		selectedKeys: [],
		currentMenuId: '',
		isTreeLoading: false,
		isStopLoading: false,
		isDelLoading: false,
		isTableLoading: false
	}

	componentWillMount() {
		this.onLoadMenuTreeData((id) => {
			// 默认选中第一个树节点
			this.setState({
				currentMenuId: id
			})
			this.onLoadActionListData()
		})
	}

	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}

	onLoadMenuTreeData = (callback) => {
		this.setState({ isTreeLoading: true })

		request.send(HTTP_CMD.MENU_TREE).then((res) => {
			const data = res.data

			this.setState({
				menuTreeData: data,
				isTreeLoading: false,
				selectedKeys: data.length ? [String(data[0].menuNodeId)] : []
			})

			return typeof callback === 'function' && callback(res.data[0].menuNodeId)
		}).catch(() => {
			this.setState({ isTreeLoading: false })
		})
	}

	onLoadActionListData = () => {
		this.setState({
			isTableLoading: true
		})

		request.send(HTTP_CMD.FEATURE_LIST, {
			menuNodeId: this.state.currentMenuId
		}).then((res) => {
			this.setState({
				actionListData: res.data,
				isTableLoading: false
			})
		}).catch(() => {
			this.setState({ isTableLoading: false })
		})
	}

	handleEditAction = (val) => {
		const { history, match } = this.props

		history.push(`${match.url}/edit-action`, {
			isEdit: true,
			menuTreeData: this.state.menuTreeData,
			menuNodeId: this.state.currentMenuId,
			actionId: val
		})
	}

	handleAddAction = () => {
		const { history, match } = this.props

		history.push(`${match.url}/add-action`, {
			menuTreeData: this.state.menuTreeData,
			menuNodeId: this.state.currentMenuId
		})
	}

	handleAddMenu = (val) => {
		const { history, match } = this.props

		history.push(`${match.url}/add-menu`, {
			menuTreeData: this.state.menuTreeData,
			menuNodeId: val
		})
	}

	handleEditMenu = (val) => {
		const { history, match } = this.props

		history.push(`${match.url}/edit-menu`, {
			isEdit: true,
			menuTreeData: this.state.menuTreeData,
			menuNodeId: val
		})
	}

	handleDeleteMenu = (val) => {
		helper.confirm('确定删除该菜单？').then(() => {
			request.send(HTTP_CMD.DEL_MENU, {
				menuNodeId: val
			}).then((res) => {
				// 确认是否强制删除
				if (+res.code === 210) {
					helper.confirm(res.msg).then(() => {
						request.send(HTTP_CMD.DEL_MENU, {
							menuNodeId: val,
							forceDelete: 1
						}).then(() => {
							message.success('删除成功')
							this.onLoadMenuTreeData()
						})
					})
				} else {
					message.success('删除成功')
					this.onLoadMenuTreeData()
				}
			})
		})
	}

	handleDeleteAction = (val) => {
		helper.confirm('确定删除该功能？').then(() => {
			request.send(HTTP_CMD.DEL_ACTION, {
				menuNodeId: this.state.currentMenuId,
				actionId: val
			}).then(() => {
				message.success('删除成功')
				this.onLoadActionListData()
			})
		})
	}

	handleSelectTreeNode = (selectedKeys, e) => {
		this.setState({
			selectedKeys
		})

		if (!e.selected) return

		this.setState({
			selectedRowKeys: [],
			currentMenuId: selectedKeys[0]
		})

		setTimeout(() => {
			this.onLoadActionListData()
		}, 0)
	}

	handleStopStartAction = (activeType) => {
		const CMD = activeType ? HTTP_CMD.START_ACTION : HTTP_CMD.STOP_ACTION

		request.send(CMD, {
			menuNodeId: this.state.currentMenuId,
			actionIdList: this.state.selectedRowKeys
		}).then(() => {
			this.onLoadActionListData()
			this.setState({
				selectedRowKeys: []
			})
			message.success('操作成功')
		})
	}

	customTreeNode = (title, id) => (
		<span>
			<span>{title}</span>
			<span style={{ marginLeft: 20 }}>
				<AuthBtn size='small' style={{ marginRight: 10 }} onClick={() => { this.handleAddMenu(id) }} actionId={ACTIONIDS_CMD.MENU_CREATE}>增加</AuthBtn>
				<AuthBtn size='small' style={{ marginRight: 10 }} onClick={() => { this.handleEditMenu(id) }} actionId={ACTIONIDS_CMD.MENU_MODIFY}>修改</AuthBtn>
				<AuthBtn size='small' style={{ marginRight: 10 }} onClick={() => { this.handleDeleteMenu(id) }} actionId={ACTIONIDS_CMD.MENU_DELETE}>删除</AuthBtn>
			</span>
		</span>
	)

	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={this.customTreeNode(item.menuNodeName, item.menuNodeId)} key={item.menuNodeId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={this.customTreeNode(item.menuNodeName, item.menuNodeId)} key={item.menuNodeId} />
	})

	render() {
		const {
			isStopLoading,
			selectedRowKeys,
			isTableLoading,
			isTreeLoading,
			actionListData,
			menuTreeData,
			selectedKeys
		} = this.state
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}
		const hasSelected = selectedRowKeys.length > 0

		return (
			<div>
				<Row>
					<Col span={6}>
						<Card className='g_nav_tree_panel' bodyStyle={{ padding: 10 }}>
							<Spin spinning={isTreeLoading}>
								<Tree
									onSelect={this.handleSelectTreeNode}
									selectedKeys={selectedKeys}
								>
									{this.renderTreeNodes(menuTreeData)}
								</Tree>
							</Spin>
						</Card>
					</Col>
					<Col span={16} offset={1}>
						<Row type='flex' justify='end' style={{ marginBottom: 20 }}>
							<Col>
								<AuthBtn
									type='primary'
									style={{ marginRight: 10 }}
									onClick={this.handleAddAction}
									actionId={ACTIONIDS_CMD.FUN_CREATE}
								>
									添加功能
								</AuthBtn>
								<AuthBtn
									type='primary'
									onClick={() => { this.handleStopStartAction(0) }}
									disabled={!hasSelected}
									loading={isStopLoading}
									style={{ marginRight: 10 }}
									actionId={ACTIONIDS_CMD.FUN_STOP}
								>
									停用
								</AuthBtn>
								<AuthBtn
									type='primary'
									onClick={() => { this.handleStopStartAction(1) }}
									disabled={!hasSelected}
									style={{ marginRight: 10 }}
									actionId={ACTIONIDS_CMD.FUN_ACTIVE}
								>
									激活
								</AuthBtn>
							</Col>
						</Row>
						<Table
							rowSelection={rowSelection}
							rowKey='actionId'
							loading={isTableLoading}
							columns={this.columns}
							dataSource={actionListData}
							pagination={false}
							scroll={{ y: 600 }}
						/>
					</Col>
				</Row>

				<Route
					path={`${this.props.match.url}/add-action`}
					render={props => <CreateFeature {...props} onLoadActionListData={() => { this.onLoadActionListData() }} />}
				/>
				<Route
					path={`${this.props.match.url}/edit-action`}
					render={props => <CreateFeature {...props} onLoadActionListData={() => { this.onLoadActionListData() }} />}
				/>

				<Route
					path={`${this.props.match.url}/add-menu`}
					render={props => <CreateMenu {...props} onLoadMenuTreeData={() => { this.onLoadMenuTreeData() }} />}
				/>
				<Route
					path={`${this.props.match.url}/edit-menu`}
					render={props => <CreateMenu {...props} onLoadMenuTreeData={() => { this.onLoadMenuTreeData() }} />}
				/>
			</div>
		)
	}
}

export default FeatureManage
