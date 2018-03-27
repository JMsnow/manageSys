import React, { Component } from 'react'
import { Menu, Icon, Dropdown, Avatar } from 'antd'
import style from './style.scss'

class TopHeader extends Component {
	state = {
		mainPosition: []
	}

	componentWillMount() {
		const currentPositionId = utils.getLocalData('currentPositionId', true)
		if (currentPositionId) {
			this.setState({
				mainPosition: [`${currentPositionId}`]
			})
		}
	}

	handleLogout = () => {
		const { history } = this.props

		request.send(HTTP_CMD.USER_LOGOUT, {}).then(() => {
			utils.removeLocalData()
			// const {
			// 	pathname,
			// 	search
			// } = window.location
			// const url = `${pathname}${search}`
			// history.push(`/auth/login?from=${encodeURIComponent(url)}`)
			history.push('/auth/login')
		})
	}

	handleChangePosition = ({ key }) => {
		if (key === 'logout') {
			this.handleLogout()
			return
		}
		if (key === utils.getLocalData('currentPositionId')) {
			return
		}
		request.send(HTTP_CMD.USER_AUTH, { positionId: key }).then((res) => {
			const allActionIds = helper.getAllActions(res.data).map(item => item.actionId)
			utils.setLocalData('authList', res.data)
			utils.setLocalData('allActionIds', allActionIds) // 存所有页面操作ID
			utils.setLocalData('currentPositionId', key)
			const { history } = this.props
			history.push('/auth/login')
		})
	}

	renderMenuItem = () => {
		const positionList = utils.getLocalData('positionList', true)
		if (!positionList) return null
		return positionList.map(item => <Menu.Item key={item.positionId} >{item.positionName}</Menu.Item>)
	}

	render() {
		const { collapsed, onClick } = this.props
		const menu = (
			<Menu selectedKeys={this.state.mainPosition} style={{ width: 100 }} onClick={this.handleChangePosition}>
				{this.renderMenuItem()}
				<Menu.Divider />
				<Menu.Item key='logout'>
					<Icon type='logout' />
					<span style={{ paddingLeft: 10 }}>退出登录</span>
				</Menu.Item>
			</Menu>
		)
		return (
			<div className={style.header}>
				<Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} className='icon' onClick={onClick} />
				<Dropdown overlay={menu}>
					<div className='user'>
						<Avatar className='avatar' icon='user' />
						{utils.getLocalData('loginName')}
					</div>
				</Dropdown>
			</div>
		)
	}
}

export default TopHeader
