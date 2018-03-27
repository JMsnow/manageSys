import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AgentList from './agent-list'
import CreateAgent from './create-agent'
import EditAgent from './edit-agent'
import Unaudited from './unaudited'
import ViewAgent from './view-agent'

class AgentManage extends Component {
	render() {
		const { match } = this.props

		return (
			<div>
				<Route path={`${match.url}/audited`} component={AgentList} />
				<Route path={`${match.url}/unaudited`} component={Unaudited} />
				<Route path={`${match.url}/create-agent`} component={CreateAgent} />
				<Route path={`${match.url}/edit-agent/:agentId`} component={EditAgent} />
				<Route path={`${match.url}/agent-detail/:agentId`} component={ViewAgent} />
			</div>
		)
	}
}

export default AgentManage
