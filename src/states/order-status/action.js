export const ADD_STATUS = 'ADD_STATUS'

export const addStatus = statuses => (
	(dispatch) => {
		dispatch({
			type: ADD_STATUS,
			payload: {
				statuses
			}
		})
	}
)

export const fetchStatus = () => (
	(dispatch, getState) => {
		const { productStatus: { statuses } } = getState()

		if (statuses.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'product_status'
		}).then((res) => {
			dispatch(addStatus(res.data))
		})
	}
)
