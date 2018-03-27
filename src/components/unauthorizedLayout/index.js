import React from 'react'
import { Route } from 'react-router-dom'
import Login from 'containers/login'

class UnauthorizedLayout extends React.Component {
	render() {
		const { match } = this.props
		return (
			<div>
				<Route path={`${match.path}/login`} component={Login} />
			</div>
		)
	}
}

export default UnauthorizedLayout
