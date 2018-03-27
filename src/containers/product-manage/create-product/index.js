import React, { Component } from 'react'
import { Card, message } from 'antd'

import { ProductHOC } from 'components/connect'

import Form from '../Form'

class CreateProduct extends Component {
	state = {
		btnLoading: false,
		product: {}
	}

	handleSubmit = (datas, flag) => {
		this.setState({
			btnLoading: true
		})

		request.send(HTTP_CMD.PRODUCT_CREATE, datas).then((res) => {
			message.success('创建产品成功')

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
			productStatus: this.props.productStatus,
			onSubmit: this.handleSubmit
		}

		return (
			<Card title='新建产品'>
				<Form {...formProps} />
			</Card>
		)
	}
}

export default ProductHOC(CreateProduct)
