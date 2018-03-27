import { ADD_SETTLE_STATUSES } from './action'

const initialState = {
	settleStatuses: []
}

export const onAddSettleStatuses = (state, action) => {
	const { settleStatuses } = action.payload

	return {
		...state,
		settleStatuses: state.settleStatuses.concat(settleStatuses)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_SETTLE_STATUSES]: onAddSettleStatuses
})

export default reducer
