import { createSlice } from '@reduxjs/toolkit'
import {when, prop, equals, always} from 'ramda'

//---------------------------------
// circuitBoardReducer name
//---------------------------------

const name = '[Viewed Chip]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = 0

//---------------------------------
// action creators
//---------------------------------

export const viewedChipIdSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setViewedChipId: (state, { payload }) => when (
      equals (state),
      always (0),
    ) (payload),
  },
})

export const { setViewedChipId } = prop ('actions') (viewedChipIdSlice)

export const { reducer } = viewedChipIdSlice
