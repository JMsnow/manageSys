import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchAgentStatuses } from 'states/agent-status/action'
import { fetchBanks } from 'states/bank/action'
import { fetchAgentTiers } from 'states/agent-tier/action'
import { fetchAgentCategories } from 'states/agent-category/action'

export const AgentHOC = (WrappedComponet) => {
	class connectHOC extends Component {
		componentWillMount() {
			const { dispatch } = this.props

			dispatch(fetchAgentStatuses())
			dispatch(fetchBanks())
			dispatch(fetchAgentTiers())
			dispatch(fetchAgentCategories())
		}

		render() {
			return (<WrappedComponet {...this.props} />)
		}
	}

	const mapStateToProps = state => (
		{
			agentStatus: state.agentStatus,
			bank: state.bank,
			agentTier: state.agentTier,
			agentCategory: state.agentCategory
		}
	)

	return connect(mapStateToProps)(connectHOC)
}

export default AgentHOC

