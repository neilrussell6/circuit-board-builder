import { combineReducers, Reducer } from 'redux'

import { reducer as mode } from '../../modules/App/mode.reducer'
import { reducer as displaySettings } from '../../modules/App/displaySettings.reducer'
import { reducer as chips } from '../../modules/Chips/reducer'
import { reducer as selectedChip } from '../../modules/App/selectedChip.reducer'
import { reducer as selectedNode } from '../../modules/App/selectedNode.reducer'
import { reducer as circuitBoard } from '../../modules/CircuitBoard/reducer'

export const rootReducer = combineReducers({
  mode,
  displaySettings,
  chips,
  selectedChip,
  selectedNode,
  circuitBoard,
})
