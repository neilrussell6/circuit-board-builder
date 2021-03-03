import { createSelector } from '@reduxjs/toolkit'

import { modeSelector } from '../../Mode/mode.selectors'
import { displaySettingsSelector } from '../circuitBoard.selectors'
import { circuitBoardSelector } from '../circuitBoard.selectors'

export const CircuitBoardSelector = createSelector(
  [modeSelector, displaySettingsSelector, circuitBoardSelector],
  (mode, displaySettings, circuitBoard) => ({
    mode,
    displaySettings,
    circuitBoard,
  }),
)
