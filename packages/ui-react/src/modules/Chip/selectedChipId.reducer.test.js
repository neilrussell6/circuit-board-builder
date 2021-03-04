import { assert } from 'chai'

import { reducer as SUT, setSelectedChipId } from './selectedChipId.reducer'

describe ('modules/Chip/selectedChipId.reducer', () => {
  describe ('setSelectedChipId', () => {
    it ('it should set the selected chip id', () => {
      // given ... there is a different chip id already selected
      const state = 1

      // when  ... we set the selected chip id
      const action = setSelectedChipId (2)
      const result = SUT (state, action)
      assert.equal(result, 2)
    })

    it ('it should deselect the selected chip id if already selected', () => {
      // given ... the chip id is already selected in state
      const state = 2

      // when  ... we set the selected chip id
      const action = setSelectedChipId (2)
      const result = SUT (state, action)
      assert.equal(result, 0)
    })
  })
})
