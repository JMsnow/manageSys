import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu

class LeftMenu extends Component {
	constructor(props) {
		super(props)
		this.menuItems = props.menuItems
		this.menu = utils.arrayToTree(this.menuItems)
	}

	state = {
		collapsed: false,
		selectedKeys: [],
		openKeys: []
	}

	componentDidMount() {
		const {
			location: {
				pathname,
				search
			}
		} = this.props

		this.computedPath(pathname, search)
	}

	componentWillReceiveProps(nextProps) {
		const {
			location: {
				pathname,
				search
			}
		} = nextProps

		this.computedPath(pathname.trim(), search)
	}

	getLevelMap(data) {
		const levelMap = {}

		data.forEach((item) => {
			if (item.children) {
				if (item.pid) {
					levelMap[item.id] = item.pid
				}
			}
		})
	}

	getPathArray = (array, current, pid, id) => {
		const result = [String(current[id])]

		const getPath = (item) => {
			if (item && item[pid]) {
				result.unshift(String(item[pid]))
				getPath(utils.queryArray(array, item[pid], id))
			}
		}

		getPath(current)
		return result
	}

	computedPath(path, search) {
		const exactPath = `${path}${search}`
		let currentMenu
		let selectedKeys = []
		let openKeys = []

		for (let i = 0; i < this.menuItems.length; i++) {
			const item = this.menuItems[i]

			const route = item.route.trim()

			if (!route) continue

			if (path.indexOf('/app/outer') > -1) {
				if (item.route === exactPath) {
					currentMenu = item
					break
				}
			} else if (path.indexOf(route) > -1) {
				currentMenu = item
				break
			}
		}

		if (currentMenu) {
			selectedKeys = this.getPathArray(this.menuItems, currentMenu, 'pid', 'id')
			openKeys = selectedKeys.slice(0, selectedKeys.length - 1)
		}

		this.setState({
			selectedKeys,
			openKeys
		})
	}

	handleOpenChange = (openKeys) => {
		this.setState({
			openKeys
		})
		// this.setState((prevState) => {
		// 	const prevOpenKeys = prevState.openKeys
		// 	const prevKey = prevOpenKeys.length > 0 ? prevOpenKeys[0] : null

		// 	let keys = openKeys

		// 	if (prevKey) {
		// 		keys = keys.filter(_ => _ !== prevKey)
		// 	}

		// 	return { openKeys: keys }
		// })
	}

	renderMenuTree = data => (
		data.map((item) => {
			if (item.children) {
				return (
					<SubMenu
						key={item.id}
						title={
							<span>
								{item.menuIcon && <Icon type={item.menuIcon} />}
								<span>{item.name}</span>
							</span>
						}
					>
						{this.renderMenuTree(item.children)}
					</SubMenu>
				)
			}
			return (
				<Menu.Item key={item.id}>
					<Link to={item.route}>
						{item.menuIcon && <Icon type={item.menuIcon} />}
						<span>{item.name}</span>
					</Link>
				</Menu.Item>
			)
		})
	)

	render() {
		const {
			selectedKeys,
			openKeys
		} = this.state

		return (
			<Menu
				mode='inline'
				theme='dark'
				selectedKeys={selectedKeys}
				openKeys={openKeys}
				onOpenChange={this.handleOpenChange}
			>
				{this.renderMenuTree(this.menu)}
			</Menu>
		)
	}
}

export default LeftMenu
