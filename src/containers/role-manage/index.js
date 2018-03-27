import React from 'react'
import { Route } from 'react-router-dom'
import RoleList from './role-list'
import RoleDetail from './role-detail'
import CreateRole from './create-role'

class RoleManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/role-detail/:roleId`} component={RoleDetail} />
				<Route path={`${match.path}/role-create`} component={CreateRole} />
				<Route path={`${match.path}/role-modify/:roleId`} component={CreateRole} />
				<Route exact path={`${match.path}`} component={RoleList} />
			</div>
		)
	}
}

export default RoleManage
