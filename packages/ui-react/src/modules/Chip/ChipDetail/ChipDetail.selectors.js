import { createSelector } from '@reduxjs/toolkit'

import { viewedChipSelector } from '../chips.selectors'

export const ChipDetailSelector = createSelector(
  [viewedChipSelector],
  chip => ({
    chip,
  }),
)
