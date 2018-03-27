import React, { Component } from 'react'
import { Row, Col, Card, message } from 'antd'
import moment from 'moment'
import GoBack from 'components/go-back'
import { ProductHOC } from 'components/connect'
import AuthButton from 'components/auth-button'

class ProductDetail extends Component {
	state = {
		product: {},
		principalData: [],
		deptTreeData: []
	}

	componentWillMount() {
		const { productId } = this.props.match.params

		this._loadDepartTree()
		this._loadPrincipalData()

		request.send(HTTP_CMD.PRODUCT_DETAIL, { productId }).then((res) => {
			this.setState({ product: res.data })
		})
	}

	_loadDepartTree = () => { // 获取部门下拉列表数据
		request.send(HTTP_CMD.DEPT_LIST_ALL_ORG).then((res) => {
			this.setState({
				deptTreeData: utils.flattenDeep(res.data)
			})
		})
	}

	_loadPrincipalData = () => { // 获取负责人下拉列表数据
		request.send(HTTP_CMD.SELECT_PRINCIPAL, { keywords: '' }).then((res) => {
			this.setState({ principalData: res.data })
		})
	}

	handleModifyProduct = () => {
		const { history, match } = this.props

		history.push(`/app/product-manage/edit-product/${match.params.productId}`)
	}

	handleUnshelfProduct = () => {
		helper.confirm('确定要下架此产品吗？').then(() => {
			const { productId } = this.props.match.params

			request.send(HTTP_CMD.PRODUCT_UNSHELF, { productId }).then(() => {
				message.success('产品下架成功')

				const { history } = this.props

				history.push('/app/product-manage/')
			}).catch(() => {
				message.error('产品下架失败')
			})
		})
	}

	render() {
		const {
			product,
			principalData,
			deptTreeData
		} = this.state

		const {
			history,
			productType: { productTypes }
		} = this.props

		const colSetting = {
			md: { span: 12 },
			xl: { span: 24 },
			style: { marginBottom: 24 }
		}

		const buttons = (
			<div>
				<AuthButton style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.PRODUCT_MODIFY} onClick={() => this.handleModifyProduct()} type='dashed'>编辑</AuthButton>
				<AuthButton style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.PRODUCT_UNSHELF} onClick={() => this.handleUnshelfProduct()} type='primary'>下架</AuthButton>
			</div>
		)
		const cardProps = {
			title: '产品详情',
			extra: buttons
		}
		const pProps = {
			style: { marginBottom: 24 }
		}

		let {
			deptIdSet,
			positionIdSet
		} = product

		const { productType } = product

		deptIdSet = deptIdSet || []
		positionIdSet = positionIdSet || []

		const deptNames = []

		deptIdSet.forEach((deptId) => {
			const dept = deptTreeData.find(_ => _.deptId === deptId)

			if (dept) deptNames.push(<p>{dept.deptName}</p>)
		})

		const principals = []

		positionIdSet.forEach((positionId) => {
			const position = principalData.find(_ => _.positionId === positionId)

			if (position) principals.push(<p>{`${position.employeeName}-${position.positionName}`}</p>)
		})

		let typeDesc = productType

		const type = productTypes.find(_ => _.columnValue === productType)

		if (type) typeDesc = type.valueDesc

		return (
			<div>
				<Row>
					<Col>
						<GoBack history={history} />
					</Col>
				</Row>
				<div style={{ marginTop: 20 }}>
					<Card {...cardProps}>
						<Row>
							<Col {...colSetting}>
								<p {...pProps}>产品编号: {product.productCode}</p>
								<p {...pProps}>产品名称: {product.productName}</p>
								<p {...pProps}>产品副标题: {product.productSubtitle}</p>
								<p {...pProps}>产品类型: {typeDesc}</p>
								<p {...pProps}>产品特色: {product.productDesc}</p>
								<p {...pProps}>产品价格: {product.productPrice}</p>
							</Col>
							<Col {...colSetting}>
								产品主图: <img src={product.productImageUrl} style={{ maxWidth: 300, maxHeight: 200, verticalAlign: 'top' }} alt='产品主图' />
							</Col>
						</Row>
						<Row>
							<Col {...colSetting}>
								<div style={{ width: 65, float: 'left' }}><p>所属组织:</p></div>
								<div style={{ marginLeft: 65 }}>{ deptNames }</div>
							</Col>
							<Col {...colSetting}>
								<div style={{ width: 50, float: 'left' }}><p>负责人:</p></div>
								<div style={{ marginLeft: 50 }}>{ principals }</div>
							</Col>
						</Row>
						<Row>
							<Col {...colSetting}>
								<p>创建时间: {product.createDt ? moment(product.createDt).format('YYYY-MM-DD') : ''}</p>
							</Col>
							<Col {...colSetting}>
								<p>创建者: {product.creator}</p>
							</Col>
							<Col {...colSetting}>
								<p>更新时间: {product.updateDt ? moment(product.updateDt).format('YYYY-MM-DD') : ''}</p>
							</Col>
							<Col {...colSetting}>
								<p>更新者: {product.updater}</p>
							</Col>
						</Row>
					</Card>
				</div>
			</div>
		)
	}
}

export default ProductHOC(ProductDetail)
