import { createSlice } from '@reduxjs/toolkit'

import { DEFAULT_CHIPS } from './constants'

//---------------------------------
// actions
//---------------------------------

const name = '[chips]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = DEFAULT_CHIPS

//---------------------------------
// action creators
//---------------------------------

export const chipsSlice = createSlice ({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setChips: (state, { payload }) => payload,
  },
})

export const { setChips } = prop ('actions') (chipsSlice)

export const { reducer } = chipsSlice
