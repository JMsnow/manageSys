import { ADD_AGENT_STATUSES } from './action'

const initialState = {
	agentStatuses: []
}

export const onAddAgentStatuses = (state, action) => {
	const { agentStatuses } = action.payload

	return {
		...state,
		agentStatuses: state.agentStatuses.concat(agentStatuses)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_AGENT_STATUSES]: onAddAgentStatuses
})

export default reducer
