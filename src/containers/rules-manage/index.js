import React from 'react'
import { Route } from 'react-router-dom'
import RulesCreates from './rules-create'
import RulesDetails from './rules-detail'
import RulesList from './rules-list'

class RulesManage extends React.Component {
	render() {
		const { path } = this.props.match
		return (
			<div>
				<Route path={`${path}/rules-modify/:id`} component={RulesCreates} />
				<Route path={`${path}/rules-detail/:id`} component={RulesDetails} />
				<Route path={`${path}/rules-create`} component={RulesCreates} />
				<Route exact path={`${path}`} component={RulesList} />
			</div>
		)
	}
}

export default RulesManage
