import { createSlice } from '@reduxjs/toolkit'

//---------------------------------
// reducer name
//---------------------------------

const name = '[Display Settings]'

//---------------------------------
// initial state
//---------------------------------

export const INITIAL_STATE = {
  vSpacing: 50,
  hSpacing: 120,
  edgeThickness: 1.4,
  edgeSpacing: 5,
  size: 20,
}

//---------------------------------
// action creators
//---------------------------------

export const displaySettingsSlice = createSlice({
  name,
  initialState: INITIAL_STATE,
  reducers: {
    setVSpacing: (state, action) => (state.vSpacing = action.payload),
    setHSpacing: (state, action) => (state.hSpacing = action.payload),
    setEdgeThickness: (state, action) => (state.edgeThickness = action.payload),
    setEdgeSpacing: (state, action) => (state.edgeSpacing = action.payload),
    setSize: (state, action) => (state.size = action.payload),
  },
})

export const {
  setVSpacing,
  setHSpacing,
  setEdgeThickness,
  setEdgeSpacing,
  setSize,
} = displaySettingsSlice.actions

export const { reducer } = displaySettingsSlice
