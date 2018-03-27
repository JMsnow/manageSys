export const ADD_AGENT_CATEGORIES = 'ADD_AGENT_CATEGORIES'

export const addAgentCategories = agentCategories => (
	(dispatch) => {
		dispatch({
			type: ADD_AGENT_CATEGORIES,
			payload: {
				agentCategories
			}
		})
	}
)

export const fetchAgentCategories = () => (
	(dispatch, getState) => {
		const { agentCategory: { agentCategories } } = getState()

		if (agentCategories.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'agent_category'
		}).then((res) => {
			dispatch(addAgentCategories(res.data))
		})
	}
)
