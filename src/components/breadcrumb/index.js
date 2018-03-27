import React, { Component } from 'react'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'

const BreadcrumbItem = Breadcrumb.Item

class BreadCrumb extends Component {
	constructor(props) {
		super(props)

		this.menuItems = helper.getMenuData()
	}

	state = {
		matches: []
	}

	componentDidMount() {
		this.computedMatches(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.computedMatches(nextProps)
	}

	computedMatches(props) {
		const {
			location: { pathname, search }
		} = props

		const route = `${pathname}${search}`
		const matches = utils.getAncestriesFromArray(this.menuItems, route)

		this.setState({ matches })
	}

	render() {
		const {
			matches
		} = this.state

		const breads = matches.map((item, index) => {
			const content = (
				<span>{item.icon
					? <Icon type={item.icon} style={{ marginRight: 4 }} />
					: ''}{item.name}</span>
			)
			return (
				<BreadcrumbItem>
					{((matches.length - 1) !== index && (['', '#'].indexOf(item.route) === -1))
						? <Link to={item.route}>
							{content}
						</Link>
						: content
					}
				</BreadcrumbItem>
			)
		})

		return (
			<Breadcrumb>
				{breads}
			</Breadcrumb>
		)
	}
}

export default BreadCrumb

