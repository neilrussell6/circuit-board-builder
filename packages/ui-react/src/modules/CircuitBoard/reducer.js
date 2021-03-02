import { createSlice } from '@reduxjs/toolkit'

//---------------------------------
// reducer name
//---------------------------------

const name = '[circuit board]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = {
  inputs: [],
  outputs: [],
  nodes: {},
}

//---------------------------------
// action creators
//---------------------------------

export const circuitBoardSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
})

export const { reducer } = circuitBoardSlice
