import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

class AuthBtn extends Component {
	_hasAuth = () => {
		const allActionCodes = utils.getLocalData('allActionCodes', true) || []
		return allActionCodes.findIndex(item => item === this.props.actionId) !== -1
	}

	render() {
		return (
			<Button
				{...this.props}
				disabled={!this._hasAuth() || this.props.disabled}
			>
				{this.props.children}
			</Button>
		)
	}
}

AuthBtn.defaultProps = {

}

AuthBtn.propTypes = {
	actionId: PropTypes.string.isRequired
}

export default AuthBtn
