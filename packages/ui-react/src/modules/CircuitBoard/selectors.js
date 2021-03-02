import { createSelector } from '@reduxjs/toolkit'
import { prop } from 'ramda'

import { modeSelector } from '../Mode/mode.selectors'
import { selectDisplaySettings } from '../App/displaySettings.selectors'

export const selectCircuitBoard = (state) => (state.circuitBoard)

export const selectInputs = createSelector(selectCircuitBoard, prop('inputs'))
export const selectOutputs = createSelector(selectCircuitBoard, prop('outputs'))
export const selectNodes = createSelector(selectCircuitBoard, prop('nodes'))

export const selector = createSelector(
  [modeSelector, selectDisplaySettings],
  (mode, displaySettings) => ({
    mode,
    displaySettings,
  }),
)
