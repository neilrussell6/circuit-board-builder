import { prop } from 'ramda'
import { assert } from 'chai'

import * as SUT from './ChipDetail.selectors'
import { DEFAULT_CHIPS } from '../constants'

describe ('modules/Chip/ChipDetails/ChipDetails.selectors', () => {
  describe ('ChipDetailSelector', () => {
    it ('should select required props from state', () => {
      // given
      // ... there are chips in state
      // ... and a viewed chip id in state
      const state = {
        chips: DEFAULT_CHIPS,
        viewedChipId: 1,
      }

      // when ... we select the required props
      const result = SUT.ChipDetailSelector (state)

      // then ... should return expected data structure
      const expected = {
        chip: prop ('1') (DEFAULT_CHIPS),
      }
      assert.deepEqual (result, expected)
    })
  })
})
