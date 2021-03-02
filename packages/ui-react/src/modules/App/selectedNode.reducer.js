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

export const selectedNodeSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedNode: (state, action) => (action.payload),
  },
})

export const { setSelectedNode } = selectedNodeSlice.actions

export const { reducer } = selectedNodeSlice
