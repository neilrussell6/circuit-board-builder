import { assert } from 'chai'

import { reducer as SUT, INITIAL_STATE, setMode } from './mode.reducer'
import { MODE } from './mode.constants'

describe('modules/Mode/mode.reducer', () => {
  describe('setMode', () => {
    it('should set mode correctly', () => {
      // when ... we set the mode
      const mode = MODE.UPDATE
      const action = setMode (mode)
      const result = SUT (INITIAL_STATE, action)
      assert.equal(result, mode)
    })
  })
})
