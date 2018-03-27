import { Button } from 'antd'
import React, { Component } from 'react'

class GoBack extends Component {
	render() {
		return (
			<Button icon='left' onClick={() => { this.props.history.goBack() }}>返回</Button>
		)
	}
}

export default GoBack
