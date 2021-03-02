import { createSelector } from '@reduxjs/toolkit'

import { selectSelectedChipId } from '../App/selectedChipId.selectors'

export const selectChips = (state) => (state.chips)

export const selector = createSelector(
  [selectChips, selectSelectedChipId],
  (chips, selectedChipId) => ({
    chips: Object.values(chips),
    selectedChipId,
  }),
)
