import { assert } from 'chai'

import { reducer as SUT, setChips, INITIAL_STATE } from './chips.reducer'

describe ('modules/Chip/chips.reducer', () => {
  describe ('setChips', () => {
    it ('should set chip correctly', () => {
      // when ... we set chips
      const chips = {
        'ID1': {
          id: 'ID1',
          name: 'NAME',
          description: 'DESCRIPTION',
          functionality: () => null,
          truthTable: [],
          inputs: [],
          outputs: [],
        },
      }
      const action = setChips (chips)
      const result = SUT (INITIAL_STATE, action)
      assert.equal (result, chips)
    })
  })
})
