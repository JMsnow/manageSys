import React from 'react'
import { Input, Table, Tag, Modal } from 'antd'

class SetRole extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedRowKeys: [],
			selectedRows: [],
			initRoles: [],
			roles: [], // 表格数据
			isShowModal: true,
			confirmLoading: false,
			tableLoading: false
		}
	}
	componentWillMount() {
		this._getRoles('', false)
	}
	_getRoles = (value, isSearch) => {
		const isFromUser = !!this.props.location.userDetailData
		const url = isFromUser ? HTTP_CMD.USER_ROLE_ENABLE : HTTP_CMD.POSITION_SELECT_ROLE // 配置url
		const params = isFromUser ? {
			userId: this.props.location.userDetailData.userId,
			textQuery: value
		} : {
			positionId: this.props.location.positionDetailData.positionId,
			roleName: value
		}
		this.setState({ tableLoading: true })
		request.send(url, params).then((res) => {
			if (isSearch) {
				this.setState({ tableLoading: false, roles: res.data })
				return
			}
			const defaultKeys = []
			const defaultRows = []
			this.setState({ tableLoading: false })
			res.data.forEach((item) => {
				if (item.select) {
					defaultKeys.push(item.roleId)
					defaultRows.push(item)
				}
			})
			this.setState({
				tableLoading: false,
				initRoles: res.data,
				roles: res.data,
				selectedRowKeys: defaultKeys,
				selectedRows: defaultRows
			})
		}).catch(() => this.setState({ tableLoading: false }))
	}
	handleSearch = (value) => {
		this._getRoles(value, true)
	}
	handleOk = () => {
		debug.log(this.state.selectedRowKeys)
		this.props.onOk(this.state.selectedRowKeys, this) // 更新父组件数据
	}
	handleCancel = () => {
		this.props.history.goBack()
	}
	render() {
		const self = this
		const columns = [
			{
				title: '角色名称',
				dataIndex: 'roleName',
				width: '30%'
			},
			{
				title: '角色描述',
				dataIndex: 'roleDesc',
				width: '30%'
			},
			{
				title: '状态',
				dataIndex: 'roleStatus',
				width: '40%',
				render: (text) => {
					if (text === 1) {
						return '有效'
					}
					if (text === 0) {
						return '无效'
					}
					return ''
				}
			}
		]
		const rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys,
			onChange(selectedRowKeys) {
				self.setState({
					selectedRowKeys,
					selectedRows: self.state.initRoles.filter(item => selectedRowKeys.indexOf(item.roleId) > -1)
				})
			}
		}
		return (
			<Modal
				closable={false}
				visible={this.state.isShowModal}
				title='选择角色'
				confirmLoading={this.state.confirmLoading}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<div>
					<div style={{ textAlign: 'right' }}>
						<Input.Search placeholder='搜索角色' style={{ width: 200 }} onSearch={this.handleSearch} />
					</div>
					<div style={{ display: 'flex', marginTop: 10 }}>
						<span style={{ flex: '0 0 60px' }}>已选择：</span>
						<div>
							{this.state.selectedRows.map(item => <Tag color='green'>{item.roleName}</Tag>)}
						</div>
					</div>
					<div style={{ marginTop: 20 }}>
						<Table
							loading={this.state.tableLoading}
							rowKey='roleId'
							columns={columns}
							dataSource={this.state.roles}
							rowSelection={rowSelection}
							pagination={false}
							scroll={{ y: 300 }}
						/>
					</div>
				</div>
			</Modal>
		)
	}
}

export default SetRole
