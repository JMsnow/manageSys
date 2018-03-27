import React from 'react'
import { Modal, Transfer, Row, Col } from 'antd'

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

class SelectPrincipal extends React.Component {
	state = {
		loadData: [],
		dataSource: data,
		targetKeys: []
	}

	componentWillMount() {
		this._loadPrincipalData()
	}

	_loadPrincipalData = () => { // 下载负责人数据
		request.send(HTTP_CMD.STAFF_LIST, { deptId: 25074 }).then((res) => {
			this.setState({ loadData: res.data })
		})
	}

	handleOk = () => {
		this.props.onOk(this)
	}

	handleCancel = () => {
		this.props.history.goBack()
	}

	handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		debug.log(targetSelectedKeys)
	}

	handleChange = (nextTargetKeys, direction, moveKeys) => {
		debug.log(moveKeys)
		this.setState({ targetKeys: nextTargetKeys })
	}

	render() {
		return (
			<Modal
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				width='700px'
				visible
				closable={false}
				title='选择负责人'
			>
				<Row type='flex' justify='center'>
					<Col>
						<Transfer
							rowKey={record => `${record.orgId}|${record.title}`}
							titles={['组织', '已选']}
							notFoundContent='没有数据'
							listStyle={{ width: 250, height: 400 }}
							dataSource={this.state.dataSource}
							showSearch
							targetKeys={this.state.targetKeys}
							onSelectChange={this.handleSelectChange}
							onChange={this.handleChange}
							render={item => item.title}
						/>
					</Col>
				</Row>
			</Modal>
		)
	}
}

export default SelectPrincipal
