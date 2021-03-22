import { assert } from 'chai'

import * as SUT from './NodeDetail.selectors'

describe ('modules/CircuitBoard/NodeDetail/NodeDetails.selectors', () => {
  describe ('NodeDetailSelector', () => {
    it ('should select required props from state', () => {
      // given
      // ... there are nodes in state
      // ... and there are chips in state
      // ... and a selected node id in state
      const chip = { id: 10, name: 'CHIP' }
      const node = { id: 1, chipId: 10, label: 'NODE' }
      const state = {
        chips: {
          '10': chip,
        },
        circuitBoard: {
          nodes: {
            '1': node,
          },
        },
        selectedNodeId: '1',
      }

      // when ... we select the required props
      // then ... should return expected data structure
      const result = SUT.NodeDetailSelector (state)
      assert.deepEqual(result, { node, chip, nodeInputs: { '0': 1, '1': 0 } })
    })
  })
})
