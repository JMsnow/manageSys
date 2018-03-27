import React, { Component } from 'react'
import GroupItem from './group-item'

class ProductGroup extends Component {
	state = {
		selectedGroups: []
	}

	onSelect = (groupId, checked) => {
		const { onSelect, multiple } = this.props
		let { selectedGroups } = this.state

		if (checked) {
			if (multiple) {
				selectedGroups = selectedGroups.concat(groupId)
			} else {
				selectedGroups = [groupId]
			}
		} else {
			const index = selectedGroups.indexOf(groupId)
			selectedGroups = [...selectedGroups.slice(0, index), ...selectedGroups.slice(index + 1)]
		}

		this.setState({
			selectedGroups
		})

		onSelect(selectedGroups)
	}

	render() {
		const { groups } = this.props
		const { selectedGroups } = this.state
		const groupItemProps = {
			onSelect: this.onSelect,
			selectedGroups
		}

		return (
			<div>
				{ groups.map(group => <GroupItem group={group} {...groupItemProps} />) }
			</div>
		)
	}
}

export default ProductGroup
