import React from 'react'
import { Modal, Row, Col, Card, Tree } from 'antd'
import DepartTree from 'components/depart-tree'

const TreeNode = Tree.TreeNode
const data = [
	{
		orgId: 1,
		title: '华南组织'
	},
	{
		orgId: 2,
		title: '华北组织'
	},
	{
		orgId: 3,
		title: '华中组织'
	}
]

class SelectOrg extends React.Component {
	state = {
		loadData: [],
		dataSource: data,
		targetKeys: []
	}

	componentWillMount() {
		this._loadPrincipalData()
	}

	render() {
		return (
			<Modal
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				width='700px'
				visible
				closable={false}
				title='选择组织'
			>
				<Row type='flex' justify='center'>
					<Col>
						<Card>
							<DepartTree checkable />
						</Card>
						<Card>
							<span>华南组织</span>
							<span>华北组织</span>
						</Card>
					</Col>
				</Row>
			</Modal>
		)
	}
}

export default SelectOrg
