import { combineReducers } from 'redux'
import ProductTypeReducer from './product-type/reducer'
import ProductStatusReducer from './product-status/reducer'
import AgentStatusReducer from './agent-status/reducer'
import BankReducer from './bank/reducer'
import AgentTierReducer from './agent-tier/reducer'
import AgentCategoryReducer from './agent-category/reducer'
import SettleStatusReducer from './settle-status/reducer'

const reducers = combineReducers({
	productType: ProductTypeReducer,
	productStatus: ProductStatusReducer,
	agentStatus: AgentStatusReducer,
	bank: BankReducer,
	agentTier: AgentTierReducer,
	agentCategory: AgentCategoryReducer,
	settleStatus: SettleStatusReducer
})

export default reducers
