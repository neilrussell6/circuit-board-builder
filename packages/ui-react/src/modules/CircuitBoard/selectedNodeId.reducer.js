import { createSlice } from '@reduxjs/toolkit'
import { prop } from 'ramda'

//---------------------------------
// circuitBoardReducer name
//---------------------------------

const name = '[selected node]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = 0

//---------------------------------
// action creators
//---------------------------------

export const selectedNodeIdSlice = createSlice ({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedNodeId: (state, { payload }) => payload,
  },
})

export const { setSelectedNodeId } = prop ('actions') (selectedNodeIdSlice)

export const { reducer } = selectedNodeIdSlice
