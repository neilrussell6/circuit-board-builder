import { createSlice } from '@reduxjs/toolkit'
import {always, equals, prop, when} from 'ramda'

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
    setSelectedNodeId: (state, { payload }) => when (
      equals (state),
      always ('0'),
    ) (payload),
  },
})

export const { setSelectedNodeId } = prop ('actions') (selectedNodeIdSlice)

export const { reducer } = selectedNodeIdSlice
