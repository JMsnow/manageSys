import { Row, Col, Form, Table, Button, Divider, message } from 'antd'
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import AuthBtn from 'components/auth-button'

import AddPosition from 'containers/department-manage/add-position'
import AddEmployee from 'containers/department-manage/add-employee'

const DetailItem = props => (
	<Col span={9}>
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
				width: '20%'
			}, {
				title: '职位描述',
				dataIndex: 'positionDesc',
				width: '20%'
			}, {
				title: '创建日期',
				dataIndex: 'createDt',
				width: '20%'
			}, {
				title: '更新日期',
				dataIndex: 'updateDt',
				width: '20%'
			}, {
				title: '操作',
				width: 150,
				dataIndex: 'positionId',
				render: val => (
					<div>
						<Link to={`/app/position-manage/position-detail/${val}`}>
							<Button style={{ marginRight: 10 }}>查看</Button>
						</Link>
						<Button onClick={() => { this.handleRemoveBindPosition(val) }}>删除</Button>
					</div>
				)
			}
		]

		this.columnsStaff = [
			{
				title: '员工',
				dataIndex: 'employeeName',
				width: '20%'
			}, {
				title: '员工账号',
				dataIndex: 'loginName',
				width: '20%'
			}, {
				title: '生效日期',
				dataIndex: 'startDt',
				width: '20%'
			}, {
				title: '失效日期',
				dataIndex: 'endDt',
				width: '20%'
			}, {
				title: '操作',
				width: 150,
				dataIndex: 'employeeId',
				render: val => (
					<div>
						<Link to={`/app/staff-manage/staff-detail/${val}`}>
							<Button style={{ marginRight: 10 }}>查看</Button>
						</Link>
						<Button onClick={() => { this.handleRemoveBindEmployee(val) }}>删除</Button>
					</div>
				)
			}
		]
	}

	state = {
		deptId: '',
		departmentDetail: {
			orgChart: {}
		},
		deptTypes: [],
		staffTableData: [],
		positionTableData: [],
		isDetailLoading: false,
		isPositionLoading: false
	}

	componentWillMount() {
		const { params } = this.props.match

		this.setState({
			deptId: +params.id
		})

		this.onLoadDepartmentDetail(params.id)
		this.getDeptTypes()
	}

	onLoadDepartmentDetail = (deptId) => {
		this.setState({ isDetailLoading: true })

		request.send(HTTP_CMD.DEPT_DETAIL, {
			deptId: deptId || this.state.deptId
		}).then((res) => {
			debug.dir(res)

			this.setState({
				departmentDetail: res.data,
				staffTableData: res.data.employeeDtoList,
				positionTableData: res.data.positionList,
				isDetailLoading: false
			})
		}).catch(() => {
			this.setState({ isDetailLoading: false })
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

	handleAddPosition = () => {
		const { history, match } = this.props

		history.push(`${match.url}/add-position`, {
			deptId: this.state.deptId,
			positionTableData: this.state.positionTableData
		})
	}

	handleAddEmployee = () => {
		const { history, match } = this.props

		history.push(`${match.url}/add-employee`, {
			deptId: this.state.deptId,
			employeeTableData: this.state.staffTableData
		})
	}

	handleEditDepartment = () => {
		const { history } = this.props
		const { state } = this.props.location
		const { deptId } = this.state
		const { orgChart } = this.state.departmentDetail

		history.push(`/app/department-manage/department-modify/${deptId}`, {
			isEdit: true,
			fDeptId: orgChart.fDeptId,
			departmentTreeData: state.departmentTreeData
		})
	}

	handleRemoveBindPosition = (val) => {
		helper.confirm('确定移除该职位？').then(() => {
			request.send(HTTP_CMD.DEPT_UNBIND_POSITION, {
				positionId: val,
				deptId: this.state.deptId
			}).then(() => {
				message.success('移除成功')
				this.onLoadDepartmentDetail()
			})
		})
	}

	handleRemoveBindEmployee = (val) => {
		helper.confirm('确定移除该员工？').then(() => {
			request.send(HTTP_CMD.DEPT_UNBIND_POSITION, {
				employeeId: val,
				deptId: this.state.deptId
			}).then(() => {
				message.success('移除成功')
				this.onLoadDepartmentDetail()
			})
		})
	}

	render() {
		const { deptName, deptCode, isActive, isOrg, orgChart, isCompany, deptType } = this.state.departmentDetail

		return (
			<div>
				<div className='g__block_flex_space-between'>
					<span style={{ fontSize: 16, color: '#000' }}>部门详情</span>
					<AuthBtn
						type='primary'
						onClick={this.handleEditDepartment}
						actionId={ACTIONIDS_CMD.DEPT_MODIFY}
					>
						编辑部门
					</AuthBtn>
				</div>
				<Row style={{ lineHeight: 2.5, marginTop: 10 }}>
					<DetailItem label='部门名称'>{deptName}</DetailItem>
					<DetailItem label='部门代码'>{deptCode}</DetailItem>
					{!!isCompany && <DetailItem label='部门类型'>{this.getDeptTypeDesc(deptType)}</DetailItem>}
					<DetailItem label='上级部门'>{orgChart.fDeptName}</DetailItem>
					<DetailItem label='是否组织'>{isOrg ? '是' : '否'}</DetailItem>
					<DetailItem label='是否公司'>{isCompany ? '是' : '否'}</DetailItem>
					<DetailItem label='是否有效'>{isActive ? '是' : '否'}</DetailItem>
					<DetailItem label='生效日期'>{orgChart.startDt}</DetailItem>
					<DetailItem label='失效日期'>{orgChart.endDt}</DetailItem>
				</Row>
				<Divider />
				<div>
					<div className='g__block_flex_space-between'>
						<span style={{ fontSize: 16, color: '#000' }}>{deptName}的职位</span>
						<AuthBtn type='primary' onClick={this.handleAddPosition} actionId={ACTIONIDS_CMD.DEPT_MODIFY}>
							添加职位
						</AuthBtn>
					</div>
					<Table
						style={{ marginTop: 15 }}
						rowKey='positionId'
						columns={this.columnsPosition}
						dataSource={this.state.positionTableData}
						pagination={false}
						scroll={{ y: 400 }}
					/>
				</div>
				<div style={{ marginTop: 30 }}>
					<div className='g__block_flex_space-between'>
						<span style={{ fontSize: 16, color: '#000' }}>{deptName}的员工</span>
						<AuthBtn type='primary' onClick={this.handleAddEmployee} actionId={ACTIONIDS_CMD.DEPT_MODIFY}>
							添加员工
						</AuthBtn>
					</div>
					<Table
						rowKey='employeeId'
						columns={this.columnsStaff}
						dataSource={this.state.staffTableData}
						pagination={false}
						style={{ marginTop: 15 }}
						scroll={{ y: 400 }}
					/>
				</div>
				<Route
					path={`${this.props.match.url}/add-position`}
					render={props => <AddPosition {...props} onLoadDepartmentDetail={() => { this.onLoadDepartmentDetail() }} />}
				/>

				<Route
					path={`${this.props.match.url}/add-employee`}
					render={props => <AddEmployee {...props} onLoadDepartmentDetail={() => { this.onLoadDepartmentDetail() }} />}
				/>
			</div>
		)
	}
}

const WrappedForm = Form.create()(CreateDepartment)

export default WrappedForm
