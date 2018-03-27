import React from 'react'
import { Route } from 'react-router-dom'
import StaffDetail from './view-staff'
import CreateStaff from './create-staff'
import StaffList from './staff-list'

class StaffManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/staff-detail/:id`} component={StaffDetail} />
				<Route path={`${match.path}/staff-create`} component={CreateStaff} />
				<Route path={`${match.path}/staff-modify/:id`} component={CreateStaff} />
				<Route exact path={`${match.path}`} component={StaffList} />
			</div>
		)
	}
}

export default StaffManage
