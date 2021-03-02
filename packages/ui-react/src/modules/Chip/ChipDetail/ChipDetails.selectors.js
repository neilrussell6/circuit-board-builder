import { createSelector } from '@reduxjs/toolkit'

import { selectedChipSelector } from '../chips.selectors'

export const ChipDetailSelector = createSelector(
  [selectedChipSelector],
  chip => ({
    chip,
  }),
)
