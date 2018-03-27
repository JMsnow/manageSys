import React from 'react'
import { Route } from 'react-router-dom'
import keepComponent from 'utils/router-keep-component'
import OrderList from './order-list'
import OrderDetail from './order-detail'

const WrapOrderList = keepComponent({
	component: OrderList,
	children: [
		{
			path: 'order-detail/:id',
			component: OrderDetail
		}
	]
})
class OrderManage extends React.Component {
	render() {
		const { path } = this.props.match
		return (
			<Route strict path={`${path}`} component={WrapOrderList} />
		)
	}
}

export default OrderManage
