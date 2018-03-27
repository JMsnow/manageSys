import React from 'react'
import { Route } from 'react-router-dom'
import FeatureList from './feature-list'

class FeatureManage extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}`} component={FeatureList} />
			</div>
		)
	}
}

export default FeatureManage
