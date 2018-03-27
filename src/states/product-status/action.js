export const ADD_PRODUCT_STATUSES = 'ADD_PRODUCT_STATUSES'

export const addStatus = productStatuses => (
	(dispatch) => {
		dispatch({
			type: ADD_PRODUCT_STATUSES,
			payload: {
				productStatuses
			}
		})
	}
)

export const fetchStatus = () => (
	(dispatch, getState) => {
		const { productStatus: { productStatuses } } = getState()

		if (productStatuses.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'product_status'
		}).then((res) => {
			dispatch(addStatus(res.data))
		})
	}
)
