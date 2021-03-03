import { assert } from 'chai'

import * as SUT from './CircuitBoard.selectors'

describe ('modules/CircuitBoard/CircuitBoard.selectors', () => {
  describe ('CircuitBoardSelector', () => {
    it ('should select required props from state', () => {
      // given
      // ... there is a mode in state
      // ... and display settings in state
      const state = {
        other: 'DATA',
        mode: 'MODE',
        displaySettings: 'DISPLAY SETTINGS',
      }

      // when ... we select the required props
      const result = SUT.CircuitBoardSelector (state)

      // then ... should return expected data structure
      const expected = {
        mode: 'MODE',
        displaySettings: 'DISPLAY SETTINGS',
      }
      assert.deepEqual(result, expected)
    })
  })
})
