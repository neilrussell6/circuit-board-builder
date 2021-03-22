import { createSelector } from '@reduxjs/toolkit'
import { values } from 'ramda'
import { chipsSelector, viewedChipIdSelector, clickedChipIdSelector } from '../chips.selectors'

export const ChipListSelector = createSelector (
  [chipsSelector, viewedChipIdSelector, clickedChipIdSelector],
  (chips, viewedChipId, clickedChipId) => ({
    chips: values (chips),
    viewedChipId,
    clickedChipId,
  }),
)
