import React, { Component } from 'react'
import { Tag } from 'antd'

class GroupItem extends Component {
	handleChange = (checked) => {
		const { onSelect, group: { id } } = this.props
		onSelect(id, checked)
	}

	render() {
		const {
			selectedGroupIds,
			group: { id }
		} = this.props

		const checked = selectedGroupIds.indexOf(id) > 0
		const props = {
			checked,
			onChange: this.handleChange
		}

		return (
			<Tag {...props} />
		)
	}
}

export default GroupItem
