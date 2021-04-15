import { createSlice } from '@reduxjs/toolkit'
import { prop } from 'ramda'

//---------------------------------
// circuitBoardReducer name
//---------------------------------

const name = '[display settings]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = {
  vspacing: 50,
  hspacing: 120,
  edgeThickness: 1.4,
  edgeSpacing: 5,
  size: 20,
  rectSize: 40,
  xOffset: -60,
}

//---------------------------------
// action creators
//---------------------------------

export const displaySettingsSlice = createSlice ({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setVSpacing: (state, { payload }) => ({ ...state, vSpacing: payload }),
    setHSpacing: (state, { payload }) => ({ ...state, hSpacing: payload }),
    setEdgeThickness: (state, { payload }) => ({ ...state, edgeThickness: payload }),
    setEdgeSpacing: (state, { payload }) => ({ ...state, edgeSpacing: payload }),
    setSize: (state, { payload }) => ({ ...state, size: payload }),
  },
})

export const {
  setVSpacing,
  setHSpacing,
  setEdgeThickness,
  setEdgeSpacing,
  setSize,
} = prop ('actions') (displaySettingsSlice)

export const { reducer } = displaySettingsSlice
