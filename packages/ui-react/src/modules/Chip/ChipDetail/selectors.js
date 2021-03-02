import { createSelector } from '@reduxjs/toolkit'

import { selectedChipSelector } from '../chips.selectors'

export const selector = createSelector(
  [selectedChipSelector],
  (chip) => ({
    chip,
  }),
)
