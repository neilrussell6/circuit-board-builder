import { assert } from 'chai'

import * as SUT from './circuitBoard.selectors'
import { DEFAULT_BLANK_NODE } from './constants'

describe ('modules/CircuitBoard/circuitBoard.selectors', () => {
  describe ('circuitBoardSelector', () => {
    it ('should select circuit board from state', () => {
      // given ... there is a circuit board in state
      const state = {
        circuitBoard: 'CIRCUIT BOARD',
      }

      // when ... we select the circuit board
      const result = SUT.circuitBoardSelector (state)
      assert.deepEqual (result, 'CIRCUIT BOARD')
    })
  })

  describe ('circuitBoardInputsSelector', () => {
    it ('should select the circuit board inputs from state', () => {
      // given ... there is a circuit board with inputs in state
      const state = {
        circuitBoard: { inputs: ['INPUT'] },
      }

      // when ... we select the circuit board inputs
      const result = SUT.circuitBoardInputsSelector (state)
      assert.deepEqual (result, ['INPUT'])
    })
  })

  describe ('circuitBoardOutputsSelector', () => {
    it ('should select the circuit board outputs from state', () => {
      // given ... there is a circuit board with outputs in state
      const state = {
        circuitBoard: { outputs: ['OUTPUT'] },
      }

      // when ... we select the circuit board outputs
      const result = SUT.circuitBoardOutputsSelector (state)
      assert.deepEqual (result, ['OUTPUT'])
    })
  })

  describe ('circuitBoardNodesSelector', () => {
    it ('should select the circuit board nodes from state', () => {
      // given ... there is a circuit board with nodes in state
      const state = {
        circuitBoard: { nodes: 'NODES' }
      }

      // when ... we select the circuit board nodes
      const result = SUT.circuitBoardNodesSelector (state)
      assert.deepEqual (result, 'NODES')
    })
  })

  describe ('selectedNodeIdSelector', () => {
    it ('should select the selected node id from state', () => {
      // given ... there is a selected node id in state
      const state = {
        selectedNodeId: 1,
      }

      // when ... we select the selected node id
      const result = SUT.selectedNodeIdSelector (state)
      assert.equal (result, 1)
    })
  })

  describe ('selectDisplaySettings', () => {
    it ('should select display settings from state', () => {
      // given ... there are display settings state
      const state = {
        displaySettings: 'DISPLAY SETTINGS',
      }

      // when ... we select the display settings
      const result = SUT.displaySettingsSelector (state)
      assert.deepEqual (result, 'DISPLAY SETTINGS')
    })
  })

  describe ('selectedNodeSelector', () => {
    it ('should return blank node if no selected node id in state', () => {
      // given
      // ... there are nodes in state
      // ... but there is no selected node id in state
      const state = {
        selectedNodeId: null,
        circuitBoard: {
          nodes: {
            '1': {},
          },
        },
      }

      // when ... we select the selected node
      const result = SUT.selectedNodeSelector (state)
      assert.deepEqual(result, DEFAULT_BLANK_NODE)
    })

    it ('should return a blank node if the selected node id does not exist in the nodes in state', () => {
      // given
      // ... there are nodes in state
      // ... but the selected node id is not in the nodes in state
      const state = {
        selectedNodeId: '100',
        circuitBoard: {
          nodes: {
            '1': {},
          },
        },
      }

      // when ... we select the selected node
      // then ... should return a blank node
      const result = SUT.selectedNodeSelector (state)
      assert.deepEqual(result, DEFAULT_BLANK_NODE)
    })

    it ('should return the selected node from state', () => {
      // given
      // ... there are nodes in state
      // ... and the selected node id is in the node in state
      const node = { some: 'data' }
      const state = {
        selectedNodeId: '1',
        circuitBoard: {
          nodes: {
            '1': node,
          },
        },
      }

      // when ... we select the selected node
      // then  ... should return selected node
      const result = SUT.selectedNodeSelector (state)
      assert.deepEqual(result, node)
    })
  })

  describe ('selectedNodeChipIdSelector', () => {
    it ('should return null if no selected node id in state', () => {
      // given
      // ... there are nodes in state
      // ... but there is no selected node id in state
      const state = {
        selectedNodeId: null,
        circuitBoard: {
          nodes: {
            '1': {},
          },
        },
      }

      // when ... we select the selected node's chip id
      // then ... should return null
      const result = SUT.selectedNodeChipIdSelector (state)
      assert.deepEqual(result, null)
    })

    it ('should return a null if the selected node id does not exist in the nodes in state', () => {
      // given
      // ... there are nodes in state
      // ... but the selected node id is not in the nodes in state
      const state = {
        selectedNodeId: '100',
        circuitBoard: {
          nodes: {
            '1': {},
          },
        },
      }

      // when ... we select the selected node's chip id
      // then ... should return null
      const result = SUT.selectedNodeChipIdSelector (state)
      assert.deepEqual(result, null)
    })

    it ('should return the selected node chip id from state', () => {
      // given
      // ... there are nodes in state
      // ... and the selected node id is in the node in state
      const node = { chipId: 10 }
      const state = {
        selectedNodeId: '1',
        circuitBoard: {
          nodes: {
            '1': node,
          },
        },
      }

      // when ... we select the selected node's chip id
      // then  ... should return correct chip id
      const result = SUT.selectedNodeChipIdSelector (state)
      assert.deepEqual(result, 10)
    })
  })
})
