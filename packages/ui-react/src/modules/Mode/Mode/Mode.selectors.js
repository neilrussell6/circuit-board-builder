import { createSelector } from '@reduxjs/toolkit'

import { modeSelector } from '../mode.selectors'

export const ModeSelector = createSelector(
  [modeSelector],
  mode => ({
    mode,
  }),
)
