import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import OrderList from './order-list'
import RebateAbnormalList from './rebate-abnormal-list'
import OrderAbnormalList from './order-abnormal-list'

class RebateProcessManage extends Component {
	render() {
		const { match: { url } } = this.props

		return (
			<div>
				<Route path={`${url}/order-list`} component={OrderList} />
				<Route path={`${url}/rebate-abnormal-list`} component={RebateAbnormalList} />
				<Route path={`${url}/order-abnormal-list`} component={OrderAbnormalList} />
			</div>
		)
	}
}

export default RebateProcessManage
