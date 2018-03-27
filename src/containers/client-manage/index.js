import React from 'react'
import { Route } from 'react-router-dom'
import ClientList from './client-list'
import ClientDetail from './client-detail'
import CreateClient from './create-client'

class ClientManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/client-detail/:clientId`} component={ClientDetail} />
				<Route path={`${match.path}/client-create`} component={CreateClient} />
				<Route path={`${match.path}/client-modify/:clientId`} component={CreateClient} />
				<Route exact path={`${match.path}`} component={ClientList} />
			</div>
		)
	}
}

export default ClientManage
