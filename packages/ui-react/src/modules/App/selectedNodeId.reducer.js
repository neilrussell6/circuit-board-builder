import { createSlice } from '@reduxjs/toolkit'

//---------------------------------
// reducer name
//---------------------------------

const name = '[Selected Node]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = 0

//---------------------------------
// action creators
//---------------------------------

export const selectedNodeIdSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedNodeId: (state, action) => (action.payload),
  },
})

export const { setSelectedNodeId } = selectedNodeIdSlice.actions

export const { reducer } = selectedNodeIdSlice
