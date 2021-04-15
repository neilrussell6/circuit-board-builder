import { assert } from 'chai'

import { reducer as SUT, setViewedChipId } from './viewedChipId.reducer'

describe ('modules/Chip/setViewedChipId.reducer', () => {
  describe ('setViewedChipId', () => {
    it ('it should set the viewed chip id', () => {
      // given ... there is a different viewed chip id in state
      const state = 1

      // when  ... we set the viewed chip id
      const action = setViewedChipId (2)
      const result = SUT (state, action)
      assert.equal (result, 2)
    })

    it ('it should deselect the viewed chip id if already selected', () => {
      // given ... the viewed chip id is already in state
      const state = 2

      // when  ... we set the viewed chip id
      const action = setViewedChipId (2)
      const result = SUT (state, action)
      assert.equal (result, 0)
    })
  })
})
