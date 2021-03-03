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

  describe ('selectedChipIdSelector', () => {
    it ('should select selected chip id from state', () => {
      // given ... there is a selected chip id in state
      const state = {
        selectedChipId: 1,
      }

      // when ... we select the selected chip id from state
      const result = SUT.selectedChipIdSelector (state)
      assert.equal(result, 1)
    })
  })

  describe ('selectedChipSelector', () => {
    it ('should return blank chip if no selected chip id in state', () => {
      // given
      // ... there are chips in state
      // ... but there is no selected chip id in state
      const state = {
        selectedChipId: null,
        chips: DEFAULT_CHIPS,
      }

      // when ... we select the selected chip
      const result = SUT.selectedChipSelector (state)
      assert.deepEqual(result, DEFAULT_BLANK_CHIP)
    })

    it ('should return a blank chip if the selected chip id does not exist in the chips in state', () => {
      // given
      // ... there are chips in state
      // ... but the selected chip id is not in the chips in state
      const state = {
        selectedChipId: 100,
        chips: DEFAULT_CHIPS,
      }

      // when ... we select the selected chip
      const result = SUT.selectedChipSelector (state)

      // then ... should return a blank chip
      assert.deepEqual(result, DEFAULT_BLANK_CHIP)
    })

    it ('should return the selected chip from state', () => {
      // given
      // ... there are chips in state
      // ... and the selected chip id is in the chips in state
      const chip = {
        ...DEFAULT_BLANK_CHIP,
        id: 100,
      }
      const state = {
        selectedChipId: 100,
        chips: {
          ...DEFAULT_CHIPS,
          '100': chip,
        },
      }

      // when ... we select the selected chip
      const result = SUT.selectedChipSelector (state)

      // then  ... should return selected chip
      assert.deepEqual(result, chip)
    })
  })
})
