import { createSlice } from '@reduxjs/toolkit'

import { MODE } from './constants'

//---------------------------------
// actions
//---------------------------------

const name = '[mode]'



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


console.log(Object.keys(modeSlice))
console.log(Object.keys(modeSlice.actions))
export const { setMode } = modeSlice.actions

export const { reducer } = modeSlice
