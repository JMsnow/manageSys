import React from 'react'
import { Route } from 'react-router-dom'
import PositionList from './position-list'
import PositionDetail from './position-detail'
import CreatePosition from './create-position'

class PositionManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/position-detail/:positionId`} component={PositionDetail} />
				<Route path={`${match.path}/position-create`} component={CreatePosition} />
				<Route path={`${match.path}/position-modify/:positionId`} component={CreatePosition} />
				<Route exact path={`${match.path}`} component={PositionList} />
			</div>
		)
	}
}

export default PositionManage
