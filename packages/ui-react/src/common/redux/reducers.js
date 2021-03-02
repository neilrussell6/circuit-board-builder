import { combineReducers, Reducer } from 'redux'

import { reducer as mode } from '../../modules/App/mode.reducer'
import { reducer as displaySettings } from '../../modules/App/displaySettings.reducer'
import { chips, selectedChipId } from '../../modules/Chip'
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
