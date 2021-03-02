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

export const selectedChipSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedChip: (state, action) => (action.payload),
  },
})

export const { setSelectedChip } = selectedChipSlice.actions

export const { reducer } = selectedChipSlice
