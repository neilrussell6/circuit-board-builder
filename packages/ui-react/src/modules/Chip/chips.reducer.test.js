import { assert } from 'chai'

import { reducer as SUT, setChips, INITIAL_STATE } from './chips.reducer'
import { lib } from '@nr6/nand2tetris-logic-gates'

describe ('modules/Chip/chips.reducer', () => {
  it ('should work', () => {
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
    assert.equal(result, chips)
  })
})
