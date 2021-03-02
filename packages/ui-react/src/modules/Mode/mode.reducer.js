import { createSlice } from '@reduxjs/toolkit'
import { prop } from 'ramda'

import { MODE } from './index'

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
    setMode: (state, { payload }) => payload,
  },
})

export const { setMode } = prop ('actions') (modeSlice)

export const { reducer } = modeSlice
