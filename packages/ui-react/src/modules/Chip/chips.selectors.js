import { createSelector } from '@reduxjs/toolkit'
import { prop, pipe, find, propEq, when, isNil, always, tap, values } from 'ramda'

import { DEFAULT_BLANK_CHIP } from './constants'

export const chipsSelector = prop ('chips')

export const viewedChipIdSelector = prop ('viewedChipId')

export const clickedChipIdSelector = prop ('clickedChipId')

export const viewedChipSelector = createSelector (
  [viewedChipIdSelector, chipsSelector],
  (chipId, chips) => pipe (
    values,
    find (propEq ('id', chipId)),
    when (
      isNil,
      always (DEFAULT_BLANK_CHIP),
    ),
  ) (chips),
)

export const clickedChipSelector = createSelector (
  [clickedChipIdSelector, chipsSelector],
  (chipId, chips) => pipe (
    values,
    find (propEq ('id', chipId)),
    when (
      isNil,
      always (DEFAULT_BLANK_CHIP),
    ),
  ) (chips),
)
