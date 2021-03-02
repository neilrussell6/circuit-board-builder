import { createSlice } from '@reduxjs/toolkit'

import { MODE } from './constants'

//---------------------------------
// reducer name
//---------------------------------

const name = '[Mode]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = MODE.INTERACTIVE

//---------------------------------
// action creators
//---------------------------------

export const modeSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setMode: (state, action) => (action.payload),
  },
})

export const { setMode } = modeSlice.actions

export const { reducer } = modeSlice
