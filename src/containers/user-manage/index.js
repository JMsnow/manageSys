import React from 'react'
import { Route } from 'react-router-dom'
import UserList from './user-list'
import UserDetail from './user-detail'
import CreateUser from './create-user'

class UserManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/user-detail/:userId`} component={UserDetail} />
				<Route path={`${match.path}/user-create`} component={CreateUser} />
				<Route path={`${match.path}/user-modify/:userId`} component={CreateUser} />
				<Route exact path={`${match.path}`} component={UserList} />
			</div>
		)
	}
}

export default UserManage
