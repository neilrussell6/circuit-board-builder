import { createSlice } from '@reduxjs/toolkit'
import { prop } from 'ramda'

import { DEFAULT_CIRCUIT_BOARD } from './constants'

//---------------------------------
// circuitBoardReducer name
//---------------------------------

const name = '[circuit board]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = DEFAULT_CIRCUIT_BOARD

//---------------------------------
// action creators
//---------------------------------

export const circuitBoardSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setCircuitBoard: (state, { payload }) => payload,
  },
})

export const { setCircuitBoard } = prop ('actions') (circuitBoardSlice)

export const { reducer } = circuitBoardSlice
