import React, { Component } from 'react'
import { Table, Row, Col, Tag, Modal, Card, Spin, Tree, Collapse } from 'antd'

const Panel = Collapse.Panel
const TreeNode = Tree.TreeNode

class SetFuntion extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hasFuns: this.props.location.hasFuns, // 已拥有的菜单和功能
			menuTreeData: [], // 请求返回的菜单数据
			actionListData: [], // 请求返回的操作数据
			selectedActionRecords: [], // 选择的操作记录
			menuNodeIdList: [], // 菜单节点ID集合
			menuNodeNameList: [], // 菜单节点名称集合
			actionIdList: [], // 操作节点ID集合
			actionNameList: [], // 操作节点名称集合

			confirmLoading: false,
			currentMenuId: '',
			isTreeLoading: false,
			isTableLoading: false,
			isShowModal: true
		}
		this.columns = [
			{
				title: '功能名称',
				dataIndex: 'actionName',
				width: '30%'
			}, {
				title: '功能代码',
				dataIndex: 'actionCode',
				width: '13%'
			}, {
				title: '功能描述',
				dataIndex: 'actionDesc',
				width: '30%'
			}, {
				title: '功能类型',
				dataIndex: 'actionType',
				width: '13%'
			}, {
				title: '状态',
				dataIndex: 'isActive',
				width: '13%',
				render: val => (
					val ? <span className='helper__color_green'>激活</span> : <span className='helper__color_red'>停用</span>
				)
			}
		]
	}
	componentWillMount() {
		debug.log(this.state.hasFuns)
		this.setState({
			selectedActionRecords: this.state.hasFuns.actions
		})
		this.onLoadMenuTreeData()
	}
	onLoadMenuTreeData = () => {
		const { menus, actions } = this.state.hasFuns
		this.setState({ isTreeLoading: true })

		request.send(HTTP_CMD.MENU_TREE).then((res) => {
			this.setState({
				isTreeLoading: false,
				menuTreeData: res.data,
				menuNodeIdList: menus.map(item => `${item.menuNodeId}`),
				menuNodeNameList: menus.map(item => item.menuNodeName),
				actionNameList: actions.map(item => item.actionName),
				actionIdList: actions.map(item => item.actionId)
			})
		}).catch(() => {
			this.setState({ isTreeLoading: false })
		})
	}
	onLoadActionListData = (menuNodeId) => {
		this.setState({
			isTableLoading: true
		})

		request.send(HTTP_CMD.FEATURE_LIST, { menuNodeId }).then((res) => {
			this.setState({
				isTableLoading: false,
				actionListData: res.data
			})
		}).catch(() => {
			this.setState({ isTableLoading: false })
		})
	}
	handleSelectTreeNode = (selectedKeys) => {
		if (!selectedKeys[0]) {
			return
		}
		this.setState({
			currentMenuId: selectedKeys[0]
		})
		this.onLoadActionListData(selectedKeys[0])
	}
	handleOk = () => {
		this.props.onOk(this, this.state.selectedActionRecords)
	}
	handleCancel = () => {
		this.props.history.goBack()
	}
	handleModify(i) {
		return () => {
			this.props.history.push(`${this.props.match.path}/create-user?id=${i}`)
		}
	}
	handleMenuCheck = (keys, e) => {
		if (!e.checked) { // 取消该菜单下面已选择的操作
			const selectedActionRecords = this.state.selectedActionRecords
			utils.remove(selectedActionRecords, item => item.menuNodeId === +e.node.props.eventKey)
			this.setState({
				selectedActionRecords,
				actionIdList: selectedActionRecords.map(item => item.actionId),
				actionNameList: selectedActionRecords.map(item => item.actionName)
			})
		}
		this.setState({
			menuNodeIdList: keys.checked,
			menuNodeNameList: e.checkedNodes.map(item => item.props.title)
		})
	}
	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.menuNodeName} key={item.menuNodeId} >
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.menuNodeName} key={item.menuNodeId} />
	})
	render() {
		const { isTableLoading, isTreeLoading, actionListData } = this.state
		const rowSelection = {
			selectedRowKeys: this.state.actionIdList,
			onSelect: (record, selected) => {
				if (selected) {
					this.setState({
						selectedActionRecords: [...this.state.selectedActionRecords, record]
					})
					if (this.state.menuNodeIdList.indexOf(this.state.currentMenuId) < 0) { // 若对应的菜单没选上则自动选上
						this.setState({
							menuNodeIdList: [...this.state.menuNodeIdList, this.state.currentMenuId],
							menuNodeNameList: [...this.state.menuNodeNameList, record.menuNodeName]
						})
					}
				} else {
					const selectedActionRecords = this.state.selectedActionRecords
					const recordIndex = selectedActionRecords.findIndex(item => item.actionId === record.actionId)
					selectedActionRecords.splice(recordIndex, 1)
					this.setState({ selectedActionRecords })
				}
				setTimeout(() => {
					this.setState({
						actionNameList: this.state.selectedActionRecords.map(item => item.actionName)
					})
				}, 100)
			},
			onSelectAll: (selected, selectedRows, changeRows) => {
				const selectedActionRecords = this.state.selectedActionRecords
				const changeRowKeys = changeRows.map(item => item.actionId)
				if (selected) {
					this.setState({
						selectedActionRecords: [...this.state.selectedActionRecords, ...changeRows]
					})
					if (this.state.menuNodeIdList.indexOf(this.state.currentMenuId) < 0) { // 若对应的菜单没选上则自动选上
						this.setState({
							menuNodeIdList: [...this.state.menuNodeIdList, this.state.currentMenuId],
							menuNodeNameList: [...this.state.menuNodeNameList, changeRows[0].menuNodeName]
						})
					}
				} else {
					utils.remove(selectedActionRecords, item => changeRowKeys.indexOf(item.actionId) > -1)
					this.setState({ selectedActionRecords })
				}
				setTimeout(() => {
					this.setState({
						actionNameList: this.state.selectedActionRecords.map(item => item.actionName)
					})
				}, 100)
			},
			onChange: (selectedRowKeys) => {
				this.setState({
					actionIdList: selectedRowKeys
				})
			}
		}
		return (
			<Modal
				closable={false}
				visible={this.state.isShowModal}
				title='角色配置功能'
				width='900'
				bodyStyle={{ height: '700px', overflowY: 'auto' }}
				confirmLoading={this.state.confirmLoading}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<Row>
					<Col span={24}>
						<Collapse defaultActiveKey={['1']} style={{ border: 0 }}>
							<Panel header='已拥有菜单' key='1' style={{ border: 0, overflowY: 'auto', maxHeight: 200 }}>
								{this.state.menuNodeNameList.map(item => <Tag color='green' style={{ margin: '5px' }}>{item}</Tag>)}
							</Panel>
							<Panel header='已拥有操作' key='2' style={{ border: 0, overflowY: 'auto', maxHeight: 200 }}>
								{this.state.actionNameList.map(item => <Tag color='green' style={{ margin: '5px' }}>{item}</Tag>)}
							</Panel>
						</Collapse>
					</Col>
				</Row>
				<Row>
					<Col span={5} style={{ paddingTop: 20 }}>
						<Card title='菜单列表'>
							<Spin spinning={isTreeLoading}>
								<Tree
									checkStrictly
									checkable
									checkedKeys={this.state.menuNodeIdList}
									onCheck={this.handleMenuCheck}
									onSelect={this.handleSelectTreeNode}
								>
									{this.renderTreeNodes(this.state.menuTreeData)}
								</Tree>
							</Spin>
						</Card>
					</Col>
					<Col span={18} offset={1}>
						<div style={{ marginTop: 20 }}>
							<Table
								hideDefaultSelections
								rowSelection={rowSelection}
								rowKey='actionId'
								loading={isTableLoading}
								columns={this.columns}
								dataSource={actionListData}
								pagination={false}
								scroll={{ y: 400 }}
							/>
						</div>
					</Col>
				</Row>
			</Modal>
		)
	}
}
export default SetFuntion
