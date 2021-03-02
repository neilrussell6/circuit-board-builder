import { createSlice } from '@reduxjs/toolkit'

//---------------------------------
// reducer name
//---------------------------------

const name = '[Selected Chip]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = 0

//---------------------------------
// action creators
//---------------------------------

export const selectedChipIdSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedChipId: (state, action) => (action.payload),
  },
})

export const { setSelectedChipId } = selectedChipIdSlice.actions

export const { reducer } = selectedChipIdSlice
