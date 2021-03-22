import { createSlice } from '@reduxjs/toolkit'
import {when, prop, equals, always} from 'ramda'

//---------------------------------
// circuitBoardReducer name
//---------------------------------

const name = '[Clicked Chip]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = 0

//---------------------------------
// action creators
//---------------------------------

export const clickedChipIdSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setClickedChipId: (state, { payload }) => when (
      equals (state),
      always (0),
    ) (payload),
  },
})

export const { setClickedChipId } = prop ('actions') (clickedChipIdSlice)

export const { reducer } = clickedChipIdSlice
