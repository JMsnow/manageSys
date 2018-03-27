import { Table, Row, Col, message, Input, Icon } from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'
import AuthBtn from 'components/auth-button'

class DepartmentManage extends Component {
	constructor(props) {
		super(props)

		this.columns = [
			{
				title: '员工编号',
				dataIndex: 'employeeCode'
			}, {
				title: '员工姓名',
				dataIndex: 'employeeName'
			},
			{
				title: '主职位',
				dataIndex: 'positionName'
			},
			{
				title: '邮箱',
				dataIndex: 'email'
			}, {
				title: '电话',
				dataIndex: 'mobile'
			}, {
				title: '状态',
				dataIndex: 'employeeState',
				render: val => (
					val ? <span className='helper__color_green'>启用</span> : <span className='helper__color_red'>停用</span>
				)
			}, {
				title: '操作',
				// width: 230,
				dataIndex: 'employeeId',
				render: val => (
					<div className='g__block_flex_space-between'>
						<Link to={{
							pathname: `/app/staff-manage/staff-detail/${val}`
						}}
						>
							<AuthBtn style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.STAFF_DETAIL}>查看</AuthBtn>
						</Link>
						<AuthBtn style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.STAFF_MODIFY} onClick={() => { this.handleEditStaff(val) }}>编辑</AuthBtn>
						{/* <AuthBtn actionId={ACTIONIDS_CMD.STAFF_DELETE} onClick={() => { this.handleDeleteStaff(val) }}>删除</AuthBtn> */}
					</div>
				)
			}
		]

		this.deLoadData = debounce(this.onLoadStaffListData, 1000)
	}

	state = {
		staffListData: [],
		selectedRowKeys: [],
		pagination: {
			pageSize: 10,
			current: 1
		},
		searchVal: '',
		isTableLoading: false
	}

	componentWillMount() {
		const page = utils.getParameterByName('page')

		this.setState({
			pagination: {
				...this.state.pagination,
				current: page || 1
			}
		})
	}

	componentDidMount() {
		this.onLoadStaffListData()
	}

	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}

	onLoadStaffListData = (searchVal) => {
		const { pagination } = this.state

		this.setState({
			isTableLoading: true
		})

		const params = {
			current: pagination.current,
			size: pagination.pageSize,
			condition: {
				textQuery: searchVal || ''
			}
		}

		request.send(HTTP_CMD.STAFF_LIST, params).then((res) => {
			pagination.total = res.data.total
			pagination.current = res.data.current

			this.setState({
				staffListData: res.data.records,
				isTableLoading: false,
				pagination
			})
		}).catch(() => {
			this.setState({ isTableLoading: false })
		})
	}

	onChangeSearch = (e) => {
		const val = e.target.value
		this.setState({
			searchVal: val,
			pagination: {
				...this.state.pagination,
				current: 1
			}
		})
		this.deLoadData(val)
	}

	handleTableChange = (pagination) => {
		const { history } = this.props

		this.setState({
			pagination
		})

		history.push(`/app/staff-manage?page=${pagination.current}`)

		setTimeout(() => {
			this.onLoadStaffListData()
		}, 0)
	}

	handleEditStaff = (val) => {
		const { history, match } = this.props

		history.push(`${match.url}/staff-modify/${val}`, {
			isEdit: true
		})
	}

	handleDeleteStaff = (val) => {
		helper.confirm('确定删除该员工？').then(() => {
			request.send(HTTP_CMD.DEL_STAFF, {
				employeeId: val
			}).then(() => {
				message.success('删除成功')
				this.onLoadStaffListData()
			})
		})
	}

	handleCreateStaff = () => {
		const { history, match } = this.props

		history.push(`${match.url}/staff-create`, {})
	}

	handleAbleStaff = (activeType) => {
		const CMD = activeType ? HTTP_CMD.ENABLE_STAFF : HTTP_CMD.DISABLE_STAFF

		request.send(CMD, {
			employeeIdList: this.state.selectedRowKeys
		}).then(() => {
			this.onLoadStaffListData()
			this.setState({
				selectedRowKeys: []
			})
			message.success('操作成功')
		})
	}

	emitEmpty = () => {
		this.searchInput.focus()
		// this.searchInput.refs.input.value = ''
		this.setState({ searchVal: '' }, () => {
			this.onLoadStaffListData()
		})
	}

	render() {
		const { isTableLoading, selectedRowKeys, staffListData, searchVal } = this.state
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		}
		const hasSelected = selectedRowKeys.length > 0

		const suffix = searchVal ? <Icon type='close-circle' onClick={this.emitEmpty} /> : null

		return (
			<div>
				<Row type='flex' justify='space-between' style={{ marginBottom: 10 }}>
					<Col>
						<Input
							onChange={this.onChangeSearch}
							placeholder='请输入关键词搜索'
							style={{ width: 200 }}
							suffix={suffix}
							value={searchVal}
							ref={(node) => { this.searchInput = node }}
						/>
					</Col>
					<Col>
						<AuthBtn actionId={ACTIONIDS_CMD.STAFF_CREATE} type='primary' onClick={this.handleCreateStaff} style={{ marginRight: 10 }}>新建员工</AuthBtn>
						<AuthBtn actionId={ACTIONIDS_CMD.STAFF_STOP} type='primary' onClick={() => { this.handleAbleStaff(0) }} disabled={!hasSelected} style={{ marginRight: 10 }}>停用</AuthBtn>
						<AuthBtn actionId={ACTIONIDS_CMD.STAFF_ACTIVE} type='primary' onClick={() => { this.handleAbleStaff(1) }} disabled={!hasSelected}>激活</AuthBtn>
					</Col>
				</Row>
				<Row>
					<Col>
						<Table
							rowSelection={rowSelection}
							rowKey='employeeId'
							pagination={this.state.pagination}
							loading={isTableLoading}
							columns={this.columns}
							dataSource={staffListData}
							onChange={this.handleTableChange}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}

export default DepartmentManage
