import { createSelector } from '@reduxjs/toolkit'
import { values, prop, pipe, find, propEq, when, isNil, always } from 'ramda'

const defaultBlankChip = {
  id: 0,
  name: '',
  description: '',
  truthTable: [],
  inputs: [],
  outputs: [],
}

export const chipsSelector = prop ('chips')

export const selectedChipIdSelector = prop ('selectedChipId')

export const selectedChipSelector = createSelector (
  [selectedChipIdSelector, chipsSelector],
  (chipId, chips) => pipe (
    find (propEq ('id', chipId)),
    when (
      isNil,
      always (defaultBlankChip),
    ),
  ) (chips),
)

export const ChipListSelector = createSelector (
  [chipsSelector, selectedChipIdSelector],
  (chips, selectedChipId) => ({
    chips: values (chips),
    selectedChipId,
  }),
)
