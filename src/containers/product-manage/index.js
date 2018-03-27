import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import ProductList from './product-list'
import CreateProduct from './create-product'
import EditProduct from './edit-product'
import ProductDetail from './product-detail'

class ProductManage extends Component {
	render() {
		const { match } = this.props

		return (
			<div>
				<Route exact path={`${match.url}`} component={ProductList} />
				<Route path={`${match.url}/create-product`} component={CreateProduct} />
				<Route path={`${match.url}/edit-product/:productId`} component={EditProduct} />
				<Route path={`${match.url}/product-detail/:productId`} component={ProductDetail} />
			</div>
		)
	}
}

export default ProductManage
