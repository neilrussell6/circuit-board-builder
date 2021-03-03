import { assert } from 'chai'

import { reducer as SUT, INITIAL_STATE, setSelectedNodeId } from './selectedNodeId.reducer'

describe('mode/CircuitBoard/selectedNodeId.reducer', () => {
  describe('setSelectedNodeId', () => {
    it('should set the selected node id correctly', () => {
      // when ... we set the selected node id
      const nodeId = 10
      const action = setSelectedNodeId (nodeId)
      const result = SUT (INITIAL_STATE, action)
      assert.equal(result, nodeId)
    })
  })
})
