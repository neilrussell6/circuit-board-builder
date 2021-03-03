import { assert } from 'chai'

import * as SUT from './circuitBoard.selectors'

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
})
