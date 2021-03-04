import { createSelector } from '@reduxjs/toolkit'
import { prop, propOr } from 'ramda'

import { DEFAULT_BLANK_NODE } from './constants'

export const circuitBoardSelector = prop ('circuitBoard')

export const circuitBoardInputsSelector = createSelector (circuitBoardSelector, prop ('inputs'))
export const circuitBoardOutputsSelector = createSelector (circuitBoardSelector, prop ('outputs'))
export const circuitBoardNodesSelector = createSelector (circuitBoardSelector, prop ('nodes'))

export const selectedNodeIdSelector = prop ('selectedNodeId')

export const displaySettingsSelector = prop ('displaySettings')

export const selectedNodeSelector = createSelector(
  [selectedNodeIdSelector, circuitBoardNodesSelector],
  (nodeId, nodes) => propOr (DEFAULT_BLANK_NODE) (nodeId) (nodes),
)
