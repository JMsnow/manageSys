import { ADD_BANKS } from './action'

const initialState = {
	banks: []
}

export const onAddBanks = (state, action) => {
	const { banks } = action.payload

	return {
		...state,
		banks: state.banks.concat(banks)
	}
}

const reducer = helper.createReducer(initialState, {
	[ADD_BANKS]: onAddBanks
})

export default reducer
