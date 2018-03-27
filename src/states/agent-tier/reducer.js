import { ADD_AGENT_TIERS } from './action'

const initialState = {
	agentTiers: []
}

export const onAddAgentTiers = (state, action) => {
	const { agentTiers } = action.payload

	return {
		...state,
		agentTiers: state.agentTiers.concat(agentTiers)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_AGENT_TIERS]: onAddAgentTiers
})

export default reducer
