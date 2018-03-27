export const ADD_PRODUCT_TYPES = 'ADD_PRODUCT_TYPES'

export const addTypes = productTypes => (
	(dispatch) => {
		dispatch({
			type: ADD_PRODUCT_TYPES,
			payload: {
				productTypes
			}
		})
	}
)

export const fetchTypes = () => (
	(dispatch, getState) => {
		const { productType: { productTypes } } = getState()

		if (productTypes.length) return

		request.send(HTTP_CMD.DICT_LIST, {
			columnName: 'product_type'
		}).then((res) => {
			dispatch(addTypes(res.data))
		})
	}
)
