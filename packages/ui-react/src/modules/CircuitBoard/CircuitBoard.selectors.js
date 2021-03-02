import { createSelector } from '@reduxjs/toolkit'

import { selectMode } from '../App/mode.selectors'
import { selectDisplaySettings } from '../App/displaySettings.selectors'

export const selector = createSelector(
  [selectMode, selectDisplaySettings],
  (mode, displaySettings) => ({
    mode,
    displaySettings,
  }),
)
