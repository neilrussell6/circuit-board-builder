import { assert } from 'chai'

import { reducer as SUT, INITIAL_STATE, setCircuitBoard } from './circuitBoard.reducer'

describe('modules/CircuitBoard/circuitBoard.reducer', () => {
  describe('setCircuitBoard', () => {
    it('should set circuit board correctly', () => {
      // when ... we set the circuit board
      const circuitBoard = {
        inputs: [1, 2],
        outputs: [3],
        nodes: {
          '1': 'NODE ONE',
          '2': 'NODE TWO',
          '3': 'NODE THREE',
        }
      }
      const action = setCircuitBoard (circuitBoard)
      const result = SUT (INITIAL_STATE, action)
      assert.deepEqual(result, circuitBoard)
    })
  })
})
