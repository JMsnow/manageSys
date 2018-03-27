import React from 'react'
import { Route } from 'react-router-dom'
import CreateDepartment from './create-department'
import DepartmentDetail from './view-department'
import DepartmentList from './department-list'

class DepartmentManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/department-detail/:id`} component={DepartmentDetail} />
				<Route path={`${match.path}/department-create`} component={CreateDepartment} />
				<Route path={`${match.path}/department-modify/:id`} component={CreateDepartment} />
				<Route exact path={`${match.path}`} component={DepartmentList} />
			</div>
		)
	}
}

export default DepartmentManage
