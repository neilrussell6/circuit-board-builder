import { createSelector } from '@reduxjs/toolkit'
import { find, propEq, pipe, ifElse, always, identity, isNil, tap} from 'ramda'

import { selectSelectedChipId } from './selectedChipId.selectors'
import { selectChips } from '../Chips/selectors'

const defaultBlankChip = {
  id: 0,
  name: '',
  description: '',
  truthTable: [],
  inputs: [],
  outputs: [],
}

export const selectSelectedChip = createSelector(
  [selectSelectedChipId, selectChips],
  (chipId, chips) => (pipe(
    find(propEq('id', chipId)),
    ifElse(
      isNil,
      always(defaultBlankChip),
      identity,
    ),
  )(Object.values(chips)))
)
