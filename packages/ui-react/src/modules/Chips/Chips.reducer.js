import { createSlice } from '@reduxjs/toolkit'

import { DEFAULT_CHIPS } from './Chips.constants'

//---------------------------------
// reducer name
//---------------------------------

const name = '[Chips]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = DEFAULT_CHIPS

//---------------------------------
// action creators
//---------------------------------

export const chipsSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setChips: (state, action) => (action.payload),
  },
})

export const { setChips } = chipsSlice.actions

export const { reducer } = chipsSlice
