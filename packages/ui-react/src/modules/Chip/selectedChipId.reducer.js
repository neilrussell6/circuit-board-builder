import { createSlice } from '@reduxjs/toolkit'
import {when, prop, equals, always} from 'ramda'

//---------------------------------
// circuitBoardReducer name
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
    setSelectedChipId: (state, { payload }) => when (
      equals (state),
      always (0),
    ) (payload),
  },
})

export const { setSelectedChipId } = prop ('actions') (selectedChipIdSlice)

export const { reducer } = selectedChipIdSlice
