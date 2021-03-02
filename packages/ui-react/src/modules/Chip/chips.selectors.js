import { createSelector } from '@reduxjs/toolkit'
import { prop, pipe, find, propEq, when, isNil, always, tap, values } from 'ramda'

import { DEFAULT_BLANK_CHIP } from './constants'

export const chipsSelector = prop ('chips')

export const selectedChipIdSelector = prop ('selectedChipId')

export const selectedChipSelector = createSelector (
  [selectedChipIdSelector, chipsSelector],
  (chipId, chips) => pipe (
    values,
    find (propEq ('id', chipId)),
    when (
      isNil,
      always (DEFAULT_BLANK_CHIP),
    ),
  ) (chips),
)
