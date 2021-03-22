import { createSelector } from '@reduxjs/toolkit'
import { values } from 'ramda'
import { chipsSelector, viewedChipIdSelector } from '../chips.selectors'

export const ChipListSelector = createSelector (
  [chipsSelector, viewedChipIdSelector],
  (chips, viewedChipId) => ({
    chips: values (chips),
    viewedChipId: viewedChipId,
  }),
)
