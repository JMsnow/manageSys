import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchStatus } from 'states/product-status/action'
import { fetchTypes } from 'states/product-type/action'

export const ProductHOC = (WrappedComponet) => {
	class connectHOC extends Component {
		componentWillMount() {
			const { dispatch } = this.props

			dispatch(fetchStatus())
			dispatch(fetchTypes())
		}

		render() {
			return (<WrappedComponet {...this.props} />)
		}
	}

	const mapStateToProps = state => (
		{
			productStatus: state.productStatus,
			productType: state.productType
		}
	)

	return connect(mapStateToProps)(connectHOC)
}

export default ProductHOC
