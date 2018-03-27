import React, { Component } from 'react'
import { Input, Table, message, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { ProductHOC } from 'components/connect'
import AuthButton from 'components/auth-button'

import styles from './index.scss'

const Search = Input.Search
const TabPane = Tabs.TabPane

class ProductList extends Component {
	constructor(props) {
		super(props)
		const allActionCodes = utils.getLocalData('allActionCodes', true)
		const tabPanels = [
			{
				tabName: '我的产品',
				actionId: 'A_9007',
				key: '0'
			},
			{
				tabName: '我团队的产品',
				actionId: 'A_9008',
				key: '1'
			},
			{
				tabName: '我组织的产品',
				actionId: 'A_9009',
				key: '2'
			},
			{
				tabName: '跨组织的产品',
				actionId: 'A_9010',
				key: '3'
			},
			{
				tabName: '所有产品',
				actionId: 'A_9011',
				key: '4'
			}
		]
		this.visibleTabPanels = tabPanels.filter(panel => (
			allActionCodes.indexOf(panel.actionId) > 0
		))
	}
	state = {
		productGroups: [],
		scenicSpots: [],
		total: 0,
		current: 1,
		dataSource: [],
		selectedRowKeys: [],
		loading: false,
		pageSize: 10,
		keywords: '',
		keywordsDisplay: ''
	}

	componentDidMount() {
		const { search } = this.props.location

		this.extractParams(search, true)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			const search = nextProps.location.search

			this.extractParams(search)
		}
	}

	getProductList = () => {
		const {
			current,
			keywords,
			pageSize,
			tabType
		} = this.state

		const params = {
			current,
			size: pageSize,
			condition: {
				keywords
			}
		}

		this.setState({
			loading: true,
			selectedRowKeys: []
		})

		const url = this._getUrlByTabType(tabType)

		request.send(url, params).then((res) => {
			const { records, total } = res.data

			this.setState({
				total,
				current: res.data.current,
				dataSource: records,
				loading: false
			})
		}).catch(() => {
			this.setState({
				loading: false,
				dataSource: []
			})
		})
	}

	getProductStatus = (status) => {
		const { productStatus: { productStatuses } } = this.props
		const item = productStatuses.find(_ => _.columnValue === status)

		return item ? item.valueDesc : status
	}

	getProductType = (type) => {
		const { productType: { productTypes } } = this.props

		const item = productTypes.find(_ => _.columnValue === type)

		return item ? item.valueDesc : type
	}

	getProductPrice = (price) => {
		if (!price || isNaN(price)) return ''

		const _price = parseFloat(Math.ceil(+price * 100) / 100)

		return _price.toFixed(2)
	}

	extractParams(search, changeDisplay) {
		const current = utils.getParameterByName('page', search) || 1
		const keywords = utils.getParameterByName('keywords', search) || ''
		const tabType = utils.getParameterByName('tabType') || this.visibleTabPanels[0].key

		if (changeDisplay) this.setState({ keywordsDisplay: keywords })

		this.setState({
			current,
			keywords,
			tabType
		}, () => {
			this.getProductList()
		})
	}

	handleSearchProduct = (value) => {
		this.setState({
			keywords: value,
			current: 1
		}, () => {
			this.handleParamsChange()
		})
	}

	handleSearchChange = (e) => {
		this.setState({
			keywordsDisplay: e.target.value
		})
	}

	handleViewProduct = (productId) => {
		const { history } = this.props

		history.push(`/app/product-manage/product-detail/${productId}`)
	}

	handleModifyProduct = (productId) => {
		const { history } = this.props

		history.push(`/app/product-manage/edit-product/${productId}`)
	}

	handleShelfProduct = (productId) => {
		helper.confirm('确定要发布此产品吗？').then(() => {
			request.send(HTTP_CMD.PRODUCT_SHELF, { productId }).then(() => {
				message.success('产品发布成功')

				this.getProductList()
			}).catch(() => {
				message.error('产品发布失败')
			})
		})
	}

	handleUnshelfProduct = (productId) => {
		helper.confirm('确定要下架此产品吗？').then(() => {
			request.send(HTTP_CMD.PRODUCT_UNSHELF, { productId }).then(() => {
				message.success('产品下架成功')

				this.getProductList()
			}).catch(() => {
				message.error('产品下架失败')
			})
		})
	}

	pageChange = (page) => {
		this.setState({
			current: page
		}, () => {
			this.handleParamsChange()
		})
	}

	handleSelect = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys
		})
	}

	handleTabChange = (tabType) => {
		this.setState({
			tabType,
			current: 1
		}, () => {
			this.handleParamsChange()
		})
	}

	handleParamsChange = () => {
		this.setState({
			selectedRowKeys: []
		})
		const {
			keywords,
			current,
			tabType
		} = this.state

		const {
			history,
			match: { url }
		} = this.props

		const params = {
			keywords,
			page: current,
			tabType
		}

		const entries = Object.keys(params).map(key => `${key}=${params[key]}`)

		history.push(`${url}?${entries.join('&')}`)
	}

	_getUrlByTabType = (tabType) => {
		switch (tabType) {
		case '0':
			return HTTP_CMD.PRODUCT_MINE
		case '1':
			return HTTP_CMD.PRODUCT_MINE_TEAM
		case '2':
			return HTTP_CMD.PRODUCT_MINE_ORG
		case '3':
			return HTTP_CMD.PRODUCT_CROSSORG
		case '4':
			return HTTP_CMD.PRODUCT_ALL
		default:
			return ''
		}
	}

	renderOperations = (productId, record) => {
		const { productStatus } = record
		const buttons = [
			<AuthButton style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.PRODUCT_DETAIL} onClick={() => this.handleViewProduct(productId)}>查看</AuthButton>,
			<AuthButton style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.PRODUCT_MODIFY} onClick={() => this.handleModifyProduct(productId)}>编辑</AuthButton>
		]

		if (productStatus === 0) {
			buttons.push(<AuthButton style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.PRODUCT_UNSHELF} onClick={() => this.handleUnshelfProduct(productId)}>下架</AuthButton>)
		} else {
			buttons.push(<AuthButton style={{ marginRight: 10 }} actionId={ACTIONIDS_CMD.PRODUCT_SHELF} onClick={() => this.handleShelfProduct(productId)}>发布</AuthButton>)
		}

		return (
			<div>
				{buttons}
			</div>
		)
	}

	render() {
		const {
			current,
			total,
			dataSource,
			selectedRowKeys,
			loading,
			keywordsDisplay,
			tabType
		} = this.state

		const searchProps = {
			style: { width: 280 },
			value: keywordsDisplay,
			onSearch: this.handleSearchProduct,
			onChange: this.handleSearchChange,
			enterButton: '搜索'
		}

		const columns = [
			{
				title: '产品编号',
				dataIndex: 'productCode'
			},
			{
				title: '产品名称',
				dataIndex: 'productName',
				width: '14%'
			},
			{
				title: '产品副标题',
				dataIndex: 'productSubtitle',
				width: '14%'
			},
			{
				title: '产品类型',
				dataIndex: 'productType',
				render: type => this.getProductType(type)
			},
			{
				title: '价格',
				dataIndex: 'productPrice',
				render: price => this.getProductPrice(price)
			},
			{
				title: '状态',
				dataIndex: 'productStatus',
				render: status => this.getProductStatus(status)
			},
			{
				title: '更新时间',
				dataIndex: 'updateDt'
			},
			{
				title: '操作',
				dataIndex: 'productId',
				width: 255,
				render: (productId, record) => this.renderOperations(productId, record)
			}
		]

		const pagination = {
			total,
			current,
			onChange: this.pageChange
		}

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleSelect
		}

		const tableProps = {
			dataSource,
			columns,
			pagination,
			rowSelection,
			loading,
			rowKey: 'productId'
		}

		return (
			<div className={styles['product-manage']}>
				<Tabs onChange={this.handleTabChange} type='card' activeKey={tabType}>
					{ this.visibleTabPanels.map(tab => <TabPane tab={tab.tabName} key={tab.key} />)}
				</Tabs>
				<div className='content-header'>
					<Search {...searchProps} />
					<Link to='product-manage/create-product'>
						<AuthButton type='primary' actionId={ACTIONIDS_CMD.PRODUCT_CREATE}>新建</AuthButton>
					</Link>
				</div>
				<div className='content-body'>
					<div className='product-list'>
						<Table {...tableProps} />
					</div>
				</div>
			</div>
		)
	}
}

export default ProductHOC(ProductList)
