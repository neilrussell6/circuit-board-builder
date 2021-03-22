import { assert } from 'chai'

import * as SUT from './utils'

describe ('modules/CircuitBoard/utils', () => {
  describe ('findNodeChipId', () => {
    it ('should return the node chip id if both exist', () => {
      // given ... node data that contain node 123 which also has a chip id
      const nodes = {
        '123': {
          chipId: 7,
        },
      }

      // when ... we find a node's chip id by node id
      // then ... should return chip id 7 as expected
      const result = SUT.findNodeChipId ('123') (nodes)
      assert.equal (result, 7)
    })

    it ('should return null if node does not exist', () => {
      // given ... node data that does contain node 123
      const nodes = {
        '0': {
          chipId: 5,
        },
      }

      // when ... we attempt to find node 123's chipd id
      // then ... should return null
      const result = SUT.findNodeChipId (123) (nodes)
      assert.equal (result, null)
    })

    it ('should return null if node exists but does not have a chip id', () => {
      // given ... node data that contains node 123, but it does not have a chip id
      const nodes = {
        '123': {
          chipId: null,
        },
      }

      // when ... we attempt to find node 123's chipd id
      // then ... should return null
      const result = SUT.findNodeChipId (123) (nodes)
      assert.equal (result, null)
    })
  })

  describe ('isTruthTableRowIsActive', () => {
    it ('should return false if node inputs do not match row', () => {
      // given
      // ... a node inputs object
      // ... and a truth table row that does not match
      const nodeInputs = {
        '0': 1, '1': 0,
      }
      const truthTableRow = [0, 0, 0]

      // when ... we check if the truth table row is active
      // then ... should return false
      const result = SUT.isTruthTableRowIsActive (nodeInputs) (truthTableRow)
      assert.equal (result, false)
    })

    it ('should return true if node inputs match row', () => {
      // given
      // ... a node inputs object
      // ... and a truth table row that matches
      const nodeInputs = {
        '0': 1, '1': 0,
      }
      const truthTableRow = [1, 0, 0]

      // when ... we check if the truth table row is active
      // then ... should return true
      const result = SUT.isTruthTableRowIsActive (nodeInputs) (truthTableRow)
      assert.equal (result, true)
    })
  })
})
