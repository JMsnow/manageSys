import React from 'react'
import { Route } from 'react-router-dom'
import OrderList from './order-list'
import OrderDetail from './order-detail'

class OrderManage extends React.Component {
	render() {
		const { path } = this.props.match
		return (
			<div>
				<Route path={`${path}/order-detail/:id`} component={OrderDetail} />
				<Route exact path={`${path}`} component={OrderList} />
			</div>
		)
	}
}

export default OrderManage
