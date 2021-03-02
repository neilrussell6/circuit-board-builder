import { combineReducers, Reducer } from 'redux'

import { reducer as mode } from '../../modules/App/mode.reducer'

export const rootReducer = combineReducers({ mode })
