import React, { Component } from 'react'
import { Icon } from 'antd'

import styles from './index.scss'

class IconPicker extends Component {
	state = {
		value: null
	}

	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			const value = nextProps.value
			this.setState({ value })
		}
	}

	getKlassName = klass => (this.state.value === klass ? 'selected' : '')

	handleClick = (klass) => {
		this.setState({
			value: klass
		})

		const { onChange } = this.props

		if (typeof onChange === 'function') {
			onChange(klass)
		}
	}

	iconClasses = [
		'inbox', 'user', 'dashboard', 'team', 'solution', 'calculator',
		'user-add', 'usergroup-add', 'shop', 'red-envelope', 'wallet',
		'bank', 'contacts', 'profile', 'global', 'fork', 'idcard', 'flag',
		'lock', 'unlock', 'setting'
	]

	render() {
		const iconClasses = this.iconClasses

		return (
			<div className={styles['icon-picker']}>
				<ul>
					{iconClasses.map(klass => <li className={this.getKlassName(klass)} onClick={() => this.handleClick(klass)}><Icon type={klass} style={{ fontSize: '16px' }} /></li>)}
				</ul>
			</div>
		)
	}
}

export default IconPicker
