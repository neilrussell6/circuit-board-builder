import { createSelector } from '@reduxjs/toolkit'

import { modeSelector } from '../../Mode/mode.selectors'
import { selectDisplaySettings } from '../circuitBoard.selectors'

export const CircuitBoardSelector = createSelector(
  [modeSelector, selectDisplaySettings],
  (mode, displaySettings) => ({
    mode,
    displaySettings,
  }),
)
