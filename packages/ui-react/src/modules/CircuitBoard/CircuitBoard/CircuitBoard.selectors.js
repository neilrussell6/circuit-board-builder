import { createSelector } from '@reduxjs/toolkit'

import { modeSelector } from '../../Mode/mode.selectors'
import { displaySettingsSelector } from '../circuitBoard.selectors'

export const CircuitBoardSelector = createSelector(
  [modeSelector, displaySettingsSelector],
  (mode, displaySettings) => ({
    mode,
    displaySettings,
  }),
)
