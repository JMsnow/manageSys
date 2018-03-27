import { Row, Col, Form, Table, Button, Divider, message } from 'antd'
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import AuthBtn from 'components/auth-button'

import AddPosition from 'containers/staff-manage/add-position'
import EditPosition from 'containers/staff-manage/edit-position'

const DetailItem = props => (
	<Col span={8}>
		<span>{props.label}：</span>
		<span style={{ color: 'rgba(0,0,0,0.5)' }}>{props.children}</span>
	</Col>
)

class CreateDepartment extends Component {
	constructor(props) {
		super(props)

		this.columnsPosition = [
			{
				title: '职位名称',
				dataIndex: 'positionName',
				width: '15%'
			}, {
				title: '职位描述',
				dataIndex: 'positionDesc',
				width: '20%'
			}, {
				title: '所属组织',
				dataIndex: 'deptName',
				width: '15%'
			}, {
				title: '是否主职位',
				dataIndex: 'isMainPosition',
				width: '15%',
				render: val => (
					val ? <span>是</span> : <span>否</span>
				)
			}, {
				title: '状态',
				dataIndex: 'isActive',
				width: '10%',
				render: val => (
					val ? <span className='helper__color_green'>启用</span> : <span className='helper__color_red'>停用</span>
				)
			}, {
				title: '操作',
				dataIndex: 'positionId',
				width: '20%',
				render: (val, record) => (
					<div>
						<Link to={`/app/position-manage/position-detail/${val}`}>
							<Button style={{ marginRight: 10 }} >查看</Button>
						</Link>
						<Button style={{ marginRight: 10 }} onClick={() => { this.handleEditPosition(val, record) }}>编辑</Button>
						<Button onClick={() => { this.handleRemovePositon(val) }}>移除</Button>
					</div>
				)
			}
		]
	}

	state = {
		employeeId: '',
		staffDetail: {},
		positionTableData: [],
		isDetailLoading: false,
		isPositionLoading: false
	}

	componentWillMount() {
		const { params } = this.props.match

		this.setState({
			employeeId: params.id
		})

		this.onLoadStaffDetail(params.id)
	}

	onLoadStaffDetail = (employeeId) => {
		const _employeeId = employeeId || this.state.employeeId

		this.setState({ isDetailLoading: true })

		request.send(HTTP_CMD.STAFF_DETAIL, {
			employeeId: _employeeId
		}).then((res) => {
			this.setState({
				staffDetail: res.data,
				isDetailLoading: false
			})

			this.onLoadStaffPosition(_employeeId)
		}).catch(() => {
			this.setState({ isDetailLoading: false })
		})
	}

	onLoadStaffPosition = (employeeId) => {
		this.setState({ isPositionLoading: true })

		request.send(HTTP_CMD.STAFF_POSITION_LIST, {
			employeeId
		}).then((res) => {
			this.setState({
				positionTableData: res.data,
				isPositionLoading: false
			})
		}).catch(() => {
			this.setState({ isPositionLoading: false })
		})
	}

	handleRemovePositon = (positionId) => {
		helper.confirm('确定移除该职位？').then(() => {
			request.send(HTTP_CMD.STAFF_REMOVE_POSTION, {
				employeeId: this.state.employeeId,
				positionId
			}).then(() => {
				message.success('移除成功')
				this.onLoadStaffPosition(this.state.employeeId)
			})
		})
	}

	handleEditStaff = () => {
		const { history } = this.props
		const { params } = this.props.match

		history.push(`/app/staff-manage/staff-modify/${params.id}`, {
			isEdit: true
		})
	}

	handleEditPosition = (val, record) => {
		const { history, match } = this.props

		history.push(`${match.url}/edit-position`, {
			employeeId: this.state.employeeId,
			positionData: record
		})
	}

	handleAddPosition = () => {
		const { history, match } = this.props

		history.push(`${match.url}/add-position`, {
			employeeId: this.state.employeeId,
			mainPositionId: this.state.staffDetail.positionId,
			positionTableData: this.state.positionTableData
		})
	}

	render() {
		const { staffDetail } = this.state

		return (
			<div>
				<div className='g__block_flex_space-between'>
					<span style={{ fontSize: 16, color: '#000' }}>员工详情</span>
					<AuthBtn
						type='primary'
						onClick={this.handleEditStaff}
						actionId={ACTIONIDS_CMD.STAFF_MODIFY}
					>
						编辑员工
					</AuthBtn>
				</div>
				<Row style={{ lineHeight: 2.5, marginTop: 10 }}>
					<DetailItem label='员工姓名'>{staffDetail.employeeName}</DetailItem>
					<DetailItem label='员工编号'>{staffDetail.employeeCode}</DetailItem>
					<DetailItem label='邮箱'>{staffDetail.email}</DetailItem>
					<DetailItem label='电话'>{staffDetail.mobile}</DetailItem>
					<DetailItem label='是否有效'>{staffDetail.employeeState ? '是' : '否'}</DetailItem>
					{/* <DetailItem label='是否离职'>{staffDetail.isLeft ? '是' : '否'}</DetailItem> */}
					<DetailItem label='是否开通账号'>{staffDetail.isUserAccount ? '是' : '否'}</DetailItem>
					<DetailItem label='用户账号'>{staffDetail.loginName}</DetailItem>
					<DetailItem label='更新日期'>{staffDetail.updateDt}</DetailItem>
					<DetailItem label='创建日期'>{staffDetail.createDt}</DetailItem>
				</Row>
				<Divider />
				<div>
					<div className='g__block_flex_space-between'>
						<span style={{ fontSize: 16, color: '#000' }}>{staffDetail.employeeName}的职位</span>
						<AuthBtn type='primary' onClick={this.handleAddPosition} actionId={ACTIONIDS_CMD.STAFF_POSITION_ADD}>
							添加职位
						</AuthBtn>
					</div>
					<Table
						rowKey='positionId'
						columns={this.columnsPosition}
						dataSource={this.state.positionTableData}
						pagination={false}
						style={{ marginTop: 15 }}
						scroll={{ y: 400 }}
					/>
				</div>
				<Route
					path={`${this.props.match.url}/add-position`}
					render={props => <AddPosition {...props} onLoadStaffDetail={() => { this.onLoadStaffDetail() }} />}
				/>

				<Route
					path={`${this.props.match.url}/edit-position`}
					render={props => <EditPosition {...props} />}
				/>
			</div>
		)
	}
}

const WrappedForm = Form.create()(CreateDepartment)

export default WrappedForm
