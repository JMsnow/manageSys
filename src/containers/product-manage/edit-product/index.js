import React, { Component } from 'react'
import { Card, message } from 'antd'

import { ProductHOC } from 'components/connect'

import Form from '../Form'

class EditProduct extends Component {
	state = {
		btnLoading: false,
		product: {}
	}

	componentWillMount() {
		const { productId } = this.props.match.params

		request.send(HTTP_CMD.PRODUCT_DETAIL, { productId }).then((res) => {
			this.setState({ product: res.data })
		})
	}

	handleSubmit = (datas, flag) => {
		this.setState({
			btnLoading: true
		})

		const { productId } = this.props.match.params
		const params = {
			...datas,
			productId
		}

		request.send(HTTP_CMD.PRODUCT_UPDATE, params).then((res) => {
			message.success('编辑产品成功')

			const { history } = this.props

			if (flag === 1) {
				history.push('/app/product-manage')
			} else {
				history.push(`/app/product-manage/product-detail/${res.data}`)
			}
		}).catch(() => {
			this.setState({
				btnLoading: false
			})
		})
	}

	render() {
		const formProps = {
			...this.state,
			productType: this.props.productType,
			onSubmit: this.handleSubmit
		}

		return (
			<Card title='编辑产品'>
				<Form {...formProps} />
			</Card>
		)
	}
}

export default ProductHOC(EditProduct)
