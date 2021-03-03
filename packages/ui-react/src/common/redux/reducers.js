import { combineReducers } from 'redux'

import { mode } from '../../modules/Mode'
import { chips, selectedChipId } from '../../modules/Chip'
import { circuitBoard, displaySettings, selectedNodeId } from '../../modules/CircuitBoard'

export const rootReducer = combineReducers ({
  mode,
  displaySettings,
  chips,
  selectedChipId,
  selectedNodeId,
  circuitBoard,
})
