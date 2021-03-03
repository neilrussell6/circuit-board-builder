import { assert } from 'chai'

import * as SUT from './utils'
import { DEFAULT_CIRCUIT_BOARD } from './constants'

describe ('modules/CircuitBoard/utils', () => {
  describe ('findSelectedNodeChipId', () => {
    it ('should return 0 if searched for node is not found', () => {
      // given
      // ... a node id to search for
      // ... an object of nodes with out the search for node id
      const { nodes } = DEFAULT_CIRCUIT_BOARD
      const nodeId = 100

      // when ... we find selected node
      const result = SUT.findSelectedNodeChipId (nodeId, nodes)

      // then ... should return 0
      assert.equal (result, 0)
    })

    it ('should return the searched for node chip id', () => {
      // given
      // ... a node id to search for
      // ... an object of nodes with the search for node id
      const { nodes } = DEFAULT_CIRCUIT_BOARD
      const nodeId = 2

      // when ... we find selected node
      const result = SUT.findSelectedNodeChipId (nodeId, nodes)

      // then ... should return chip id
      assert.equal (result, 4)
    })
  })
})
