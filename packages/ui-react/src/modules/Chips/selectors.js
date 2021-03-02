import { createSelector } from '@reduxjs/toolkit'

import { selectSelectedChip } from '../App/selectedChip.selectors'

export const selectChips = (state) => (state.chips)

export const selector = createSelector(
  [selectChips, selectSelectedChip],
  (chips, selectedChip) => ({
    chips: Object.values(chips),
    selectedChip,
  }),
)
