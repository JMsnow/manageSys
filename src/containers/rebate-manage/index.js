import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import RebateList from './rebate-list'
import RebateStatement from './rebate-statement'

class RebateManage extends Component {
	render() {
		const { match } = this.props

		return (
			<div>
				<Route path={`${match.url}/rebate-list`} component={RebateList} />
				<Route path={`${match.url}/rebate-statement`} component={RebateStatement} />
			</div>
		)
	}
}

export default RebateManage
