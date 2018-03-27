import { ADD_AGENT_CATEGORIES } from './action'

const initialState = {
	agentCategories: []
}

export const onAddAgentCategories = (state, action) => {
	const { agentCategories } = action.payload

	return {
		...state,
		agentCategories: state.agentCategories.concat(agentCategories)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_AGENT_CATEGORIES]: onAddAgentCategories
})

export default reducer
