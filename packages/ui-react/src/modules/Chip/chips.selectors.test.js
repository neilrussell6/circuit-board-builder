import { assert } from 'chai'

import * as SUT from './chips.selectors'
import { DEFAULT_BLANK_CHIP, DEFAULT_CHIPS } from './constants'

describe ('modules/Chip/chips.selectors', () => {
  describe ('chipsSelector', () => {
    it ('should select chips from state', () => {
      // given ... there are chips in state
      const state = {
        chips: { 1: 'CHIP' },
      }

      // when ... we select chips from state
      const result = SUT.chipsSelector (state)

      // then ... should return a blank chip
      assert.deepEqual(result, { 1: 'CHIP' })
    })
  })

  describe ('viewedChipIdSelector', () => {
    it ('should select viewed chip id from state', () => {
      // given ... there is a viewed chip id in state
      const state = {
        viewedChipId: 1,
      }

      // when ... we select the viewed chip id from state
      const result = SUT.viewedChipIdSelector (state)
      assert.equal(result, 1)
    })
  })

  describe ('viewedChipSelector', () => {
    it ('should return blank chip if no viewed chip id in state', () => {
      // given
      // ... there are chips in state
      // ... but there is no viewed chip id in state
      const state = {
        viewedChipId: null,
        chips: DEFAULT_CHIPS,
      }

      // when ... we select the viewed chip
      const result = SUT.viewedChipSelector (state)
      assert.deepEqual(result, DEFAULT_BLANK_CHIP)
    })

    it ('should return a blank chip if the viewed chip id does not exist in the chips in state', () => {
      // given
      // ... there are chips in state
      // ... but the viewed chip id is not in the chips in state
      const state = {
        viewedChipId: 100,
        chips: DEFAULT_CHIPS,
      }

      // when ... we select the viewed chip
      const result = SUT.viewedChipSelector (state)

      // then ... should return a blank chip
      assert.deepEqual(result, DEFAULT_BLANK_CHIP)
    })

    it ('should return the viewed chip from state', () => {
      // given
      // ... there are chips in state
      // ... and the viewed chip id is in the chips in state
      const chip = {
        ...DEFAULT_BLANK_CHIP,
        id: 100,
      }
      const state = {
        viewedChipId: 100,
        chips: {
          ...DEFAULT_CHIPS,
          '100': chip,
        },
      }

      // when ... we select the viewed chip
      const result = SUT.viewedChipSelector (state)

      // then  ... should return selected chip
      assert.deepEqual(result, chip)
    })
  })
})
