import { createSelector } from '@reduxjs/toolkit'

import { selectMode } from '../App/mode.selectors'

export const selector = createSelector(
  [selectMode],
  (mode) => ({
    mode
  }),
)
