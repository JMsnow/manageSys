import { ADD_PRODUCT_STATUSES } from './action'

const initialState = {
	productStatuses: []
}

export const onAddStatuses = (state, action) => {
	const { productStatuses } = action.payload

	return {
		...state,
		productStatuses: state.productStatuses.concat(productStatuses)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_PRODUCT_STATUSES]: onAddStatuses
})

export default reducer
