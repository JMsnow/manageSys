import React, { Component } from 'react'
import { TreeSelect } from 'antd'

const TreeNode = TreeSelect.TreeNode

class DepartTree extends Component {
	constructor(props) {
		super(props)
		this.state = {
			deptTreeData: []
		}
	}
	componentWillMount() {

	}

	handleLoadData = (treeNode) => {
		const _treeNode = treeNode
		return new Promise((resolve) => {
			if (_treeNode.props.children) {
				resolve()
				return
			}
			request.send(HTTP_CMD.DEPT_LIST_ALL_WITH).then((res) => {
				_treeNode.props.dataRef.children = helper.generateJsonTree(res.data)
			})
			this.setState({ treeData: [...this.state.treeData] })
			resolve()
		})
	}


	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.deptName} value={item.deptId} key={item.deptId} dataRef={item}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} key={item.deptId} dataRef={item} />
	})

	render() {
		return (
			<TreeSelect
				loadData={this.handleLoadData}
				dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
				showSearch
				placeholder='请选择所属部门'
				treeNodeFilterProp='title'
			>
				{this.renderTreeNodes(this.state.deptTreeData)}
			</TreeSelect>
		)
	}
}

export default DepartTree
