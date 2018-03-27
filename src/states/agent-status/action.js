export const ADD_AGENT_STATUSES = 'ADD_AGENT_STATUSES'

export const addStatus = agentStatuses => (
	(dispatch) => {
		dispatch({
			type: ADD_AGENT_STATUSES,
			payload: {
				agentStatuses
			}
		})
	}
)

export const fetchAgentStatuses = () => (
	(dispatch, getState) => {
		const { agentStatus: { agentStatuses } } = getState()

		if (agentStatuses.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'agent_status'
		}).then((res) => {
			dispatch(addStatus(res.data))
		})
	}
)
