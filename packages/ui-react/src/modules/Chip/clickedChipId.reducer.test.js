import { assert } from 'chai'

import { reducer as SUT, setClickedChipId } from './clickedChipId.reducer'

describe ('modules/Chip/clickedChipId.reducer', () => {
  describe ('setClickedChipId', () => {
    it ('it should set the clicked chip id', () => {
      // given ... there is a different chip id already selected
      const state = 1

      // when  ... we set the clicked the chip id
      const action = setClickedChipId (2)
      const result = SUT (state, action)
      assert.equal (result, 2)
    })

    it ('it should deselect the clicked chip id if already selected', () => {
      // given ... the clicked chip id is already selected in state
      const state = 2

      // when  ... we set the clicked chip id
      const action = setClickedChipId (2)
      const result = SUT (state, action)
      assert.equal (result, 0)
    })
  })
})
