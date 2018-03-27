export const ADD_AGENT_TIERS = 'ADD_AGENT_TIERS'

export const addAgentTiers = agentTiers => (
	(dispatch) => {
		dispatch({
			type: ADD_AGENT_TIERS,
			payload: {
				agentTiers
			}
		})
	}
)

export const fetchAgentTiers = () => (
	(dispatch, getState) => {
		const { agentTier: { agentTiers } } = getState()

		if (agentTiers.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'agent_tier'
		}).then((res) => {
			dispatch(addAgentTiers(res.data))
		})
	}
)
