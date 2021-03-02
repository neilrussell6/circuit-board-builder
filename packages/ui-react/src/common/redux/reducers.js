import { combineReducers, Reducer } from 'redux'

import { reducer as mode } from '../../modules/App/mode.reducer'
import { reducer as displaySettings } from '../../modules/App/displaySettings.reducer'

export const rootReducer = combineReducers({
  mode,
  displaySettings,
})
