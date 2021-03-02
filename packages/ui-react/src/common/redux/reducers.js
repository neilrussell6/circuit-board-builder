import { combineReducers, Reducer } from 'redux'

import { mode } from '../../modules/Mode'
import { reducer as displaySettings } from '../../modules/App/displaySettings.reducer'
import { chips, selectedChipId } from '../../modules/Chip'
import { reducer as selectedNodeId } from '../../modules/CircuitBoard/selectedNodeId.reducer'
import { circuitBoardReducer as circuitBoard } from '../../modules/CircuitBoard/circuitBoard.reducer'

export const rootReducer = combineReducers({
  mode,
  displaySettings,
  chips,
  selectedChipId,
  selectedNodeId,
  circuitBoard,
})
