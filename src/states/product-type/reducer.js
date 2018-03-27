import { ADD_PRODUCT_TYPES } from './action'

const initialState = {
	productTypes: []
}

export const onAddTypes = (state, action) => {
	const { productTypes } = action.payload

	return {
		...state,
		productTypes: state.productTypes.concat(productTypes)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_PRODUCT_TYPES]: onAddTypes
})

export default reducer
