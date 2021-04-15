import { assert } from 'chai'

import * as SUT from './Mode.selectors'

describe ('modules/Mode/Mode/Mode.selectors', () => {
  describe ('ModeSelector', () => {
    it ('should select required props from state', () => {
      // given ... there is a mode in state
      const state = { mode: 'MODE' }

      // when ... we select the required props
      const result = SUT.ModeSelector (state)

      // then ... should return expected data structure
      assert.deepEqual (result, { mode: 'MODE' })
    })
  })
})
