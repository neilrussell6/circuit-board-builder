import { assert } from 'chai'

import * as SUT from './mode.selectors'
import { MODE } from './mode.constants'

describe ('moduels/Mode/mode.selectors', () => {
  describe ('modeSelector', () => {
    it ('should select mode from state', () => {
      // given ... there is a mode is state
      const state = {
        mode: MODE.INTERACTIVE,
      }

      // when ... we select the mode
      const result = SUT.modeSelector (state)
      assert.equal (result, MODE.INTERACTIVE)
    })
  })
})
