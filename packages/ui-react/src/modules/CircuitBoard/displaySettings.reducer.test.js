import { assert } from 'chai'

import {
  reducer as SUT,
  INITIAL_STATE,
  setSize,
  setHSpacing,
  setVSpacing,
  setEdgeThickness,
  setEdgeSpacing,
} from './displaySettings.reducer'

describe('modules/CircuitBoard/displaySettings.reducer', () => {
  describe('setSize', () => {
    it('should set the size correctly', () => {
      // when ... we set the size
      const size = 100
      const action = setSize (size)
      const result = SUT (INITIAL_STATE, action)
      assert.deepEqual(result, { ...INITIAL_STATE, size })
    })
  })

  describe('setHSpacing', () => {
    it('should set the h spacing correctly', () => {
      // when ... we set the h spacing
      const hSpacing = 100
      const action = setHSpacing (hSpacing)
      const result = SUT (INITIAL_STATE, action)
      assert.deepEqual(result, { ...INITIAL_STATE, hSpacing })
    })
  })

  describe('setVSpacing', () => {
    it('should set the v spacing correctly', () => {
      // when ... we set the v spacing
      const vSpacing = 100
      const action = setVSpacing (vSpacing)
      const result = SUT (INITIAL_STATE, action)
      assert.deepEqual(result, { ...INITIAL_STATE, vSpacing })
    })
  })

  describe('setEdgeThickness', () => {
    it('should set the edge thickness correctly', () => {
      // when ... we set the edge thickness
      const edgeThickness = 100
      const action = setEdgeThickness (edgeThickness)
      const result = SUT (INITIAL_STATE, action)
      assert.deepEqual(result, { ...INITIAL_STATE, edgeThickness })
    })
  })

  describe('setEdgeSpacing', () => {
    it('should set the edge spacing correctly', () => {
      // when ... we set the edge spacing
      const edgeSpacing = 100
      const action = setEdgeSpacing (edgeSpacing)
      const result = SUT (INITIAL_STATE, action)
      assert.deepEqual(result, { ...INITIAL_STATE, edgeSpacing })
    })
  })
})
