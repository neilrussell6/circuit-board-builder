import { createSelector } from '@reduxjs/toolkit'

import { selectSelectedChip } from '../App/selectedChip.selectors'

export const selector = createSelector(
  [selectSelectedChip],
  (chip) => ({
    chip,
  }),
)
