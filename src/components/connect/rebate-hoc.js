import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchSettleStatuses } from 'states/settle-status/action'

export const RebateHOC = (WrappedComponent) => {
	class connectHOC extends Component {
		componentWillMount() {
			const { dispatch } = this.props
			dispatch(fetchSettleStatuses())
		}

		render() {
			return (<WrappedComponent {...this.props} />)
		}
	}

	const mapStateToProps = state => (
		{
			settleStatus: state.settleStatus
		}
	)

	return connect(mapStateToProps)(connectHOC)
}

export default RebateHOC
