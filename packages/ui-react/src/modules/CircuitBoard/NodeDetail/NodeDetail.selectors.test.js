import { assert } from 'chai'

import * as SUT from './NodeDetail.selectors'

describe ('modules/CircuitBoard/NodeDetail/NodeDetails.selectors', () => {
  describe ('NodeDetailSelector', () => {
    it ('should select required props from state', () => {
      // given
      // ... there are nodes in state
      // ... and a selected node id in state
      const node = { some: 'data' }
      const state = {
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
      assert.deepEqual(result, { node })
    })
  })
})
