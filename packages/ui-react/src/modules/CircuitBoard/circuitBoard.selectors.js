import { createSelector } from '@reduxjs/toolkit'
import { prop, propOr } from 'ramda'

import { DEFAULT_BLANK_NODE } from './constants'
import { DEFAULT_BLANK_CHIP } from '../Chip/constants'
import { chipsSelector } from '../Chip/chips.selectors'

export const circuitBoardSelector = prop ('circuitBoard')
// TODO: use this when we solve the id problem in CircuitBoard.jsx RE: merging graphData and UI data
// export const circuitBoardSelector = createSelector ([prop ('circuitBoard')], circuitBoard => assocUniqueIds (circuitBoard))

export const circuitBoardInputsSelector = createSelector (circuitBoardSelector, prop ('inputs'))
export const circuitBoardOutputsSelector = createSelector (circuitBoardSelector, prop ('outputs'))
export const circuitBoardNodesSelector = createSelector (circuitBoardSelector, prop ('nodes'))

export const selectedNodeIdSelector = prop ('selectedNodeId')

export const displaySettingsSelector = prop ('displaySettings')

export const selectedNodeSelector = createSelector (
  [selectedNodeIdSelector, circuitBoardNodesSelector],
  (nodeId, nodes) => propOr (DEFAULT_BLANK_NODE) (nodeId) (nodes),
)

export const selectedNodeChipIdSelector = createSelector (selectedNodeSelector, prop ('chipId'))

export const selectedNodeChipSelector = createSelector (
  [selectedNodeChipIdSelector, chipsSelector],
  (chipId, chips) => propOr (DEFAULT_BLANK_CHIP) (chipId) (chips),
)
