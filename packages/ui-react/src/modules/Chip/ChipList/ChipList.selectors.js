import { createSelector } from '@reduxjs/toolkit'
import { values } from 'ramda'
import { chipsSelector, selectedChipIdSelector } from '../chips.selectors'

export const ChipListSelector = createSelector (
  [chipsSelector, selectedChipIdSelector],
  (chips, selectedChipId) => ({
    chips: values (chips),
    selectedChipId,
  }),
)
