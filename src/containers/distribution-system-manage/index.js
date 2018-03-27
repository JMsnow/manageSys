import React from 'react'
import { Route } from 'react-router-dom'
import DistributionList from './distribution-list'
import DistributionDetail from './distribution-detail'
import CreateModifyDistribution from './distribution-create-modify'

class DistributionSysManage extends React.Component {
	render() {
		const { path } = this.props.match
		return (
			<div>
				<Route path={`${path}/distribution-detail/:id`} component={DistributionDetail} />
				<Route path={`${path}/distribution-create`} component={CreateModifyDistribution} />
				<Route path={`${path}/distribution-modify/:id`} component={CreateModifyDistribution} />
				<Route exact path={`${path}`} component={DistributionList} />
			</div>
		)
	}
}

export default DistributionSysManage
