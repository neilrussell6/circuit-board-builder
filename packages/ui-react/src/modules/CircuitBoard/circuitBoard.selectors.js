import { createSelector } from '@reduxjs/toolkit'
import { prop } from 'ramda'

export const circuitBoardSelector = prop ('circuitBoard')

export const circuitBoardInputsSelector = createSelector (circuitBoardSelector, prop ('inputs'))
export const circuitBoardOutputsSelector = createSelector (circuitBoardSelector, prop ('outputs'))
export const circuitBoardNodesSelectors = createSelector (circuitBoardSelector, prop ('nodes'))

export const selectedNodeIdSelector = prop ('selectedNodeId')

export const selectDisplaySettings = prop ('displaySettings')