export const ADD_SETTLE_STATUSES = 'ADD_SETTLE_STATUSES'

export const addSettleStatuses = settleStatuses => (
	(dispatch) => {
		dispatch({
			type: ADD_SETTLE_STATUSES,
			payload: {
				settleStatuses
			}
		})
	}
)

export const fetchSettleStatuses = () => (
	(dispatch, getState) => {
		const { settleStatus: { settleStatuses } } = getState()

		if (settleStatuses.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'comm_settle_status'
		}).then((res) => {
			dispatch(addSettleStatuses(res.data))
		})
	}
)
