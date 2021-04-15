import { combineReducers } from 'redux'

import { mode } from '../../modules/Mode'
import { chips, viewedChipId, clickedChipId } from '../../modules/Chip'
import { circuitBoard, displaySettings, selectedNodeId } from '../../modules/CircuitBoard'

export const rootReducer = combineReducers ({
  mode,
  displaySettings,
  chips,
  clickedChipId,
  viewedChipId,
  selectedNodeId,
  circuitBoard,
})
