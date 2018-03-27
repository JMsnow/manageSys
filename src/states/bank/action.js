export const ADD_BANKS = 'ADD_BANKS'

export const addBanks = banks => (
	(dispatch) => {
		dispatch({
			type: ADD_BANKS,
			payload: {
				banks
			}
		})
	}
)

export const fetchBanks = () => (
	(dispatch, getState) => {
		const { bank: { banks } } = getState()

		if (banks.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'assc_bank'
		}).then((res) => {
			dispatch(addBanks(res.data))
		})
	}
)
