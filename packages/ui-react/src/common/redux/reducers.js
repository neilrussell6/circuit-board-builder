import { combineReducers, Reducer } from 'redux'

import { reducer as mode } from '../../modules/App/mode.reducer'
import { reducer as displaySettings } from '../../modules/App/displaySettings.reducer'
import { reducer as chips } from '../../modules/Chips/reducer'
import { reducer as selectedChipId } from '../../modules/App/selectedChipId.reducer'
import { reducer as selectedNodeId } from '../../modules/App/selectedNodeId.reducer'
import { reducer as circuitBoard } from '../../modules/CircuitBoard/reducer'

export const rootReducer = combineReducers({
  mode,
  displaySettings,
  chips,
  selectedChipId,
  selectedNodeId,
  circuitBoard,
})
