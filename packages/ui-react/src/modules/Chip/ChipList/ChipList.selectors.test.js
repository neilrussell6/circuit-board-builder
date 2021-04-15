import { values } from 'ramda'
import { assert } from 'chai'

import * as SUT from './ChipList.selectors'
import { DEFAULT_CHIPS } from '../constants'

describe ('modules/Chip/ChipList/ChipList.selectors', () => {
  describe ('ChipListSelector', () => {
    it ('should select required props from state', () => {
      // given
      // ... there are chips in state
      // ... and a viewed chip id in state
      // ... and a clicked chip id in state
      const state = {
        other: 'DATA',
        chips: DEFAULT_CHIPS,
        viewedChipId: 1,
        clickedChipId: 2,
      }

      // when ... we select the required props
      const result = SUT.ChipListSelector (state)

      // then ... should return expected data structure
      const expected = {
        chips: values (DEFAULT_CHIPS),
        viewedChipId: 1,
        clickedChipId: 2,
      }
      assert.deepEqual (result, expected)
    })
  })
})
