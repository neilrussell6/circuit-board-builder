
import * as SUT from './circuitBoard.middleware'
import { selectNode } from './circuitBoard.reducer'
import { DEFAULT_CIRCUIT_BOARD } from './constants'

describe.skip ('modules/CircuitBoard/circuitBoard.middleware', () => {
  describe ('selectNodeMiddleware', () => {
    it ('should listen for selectNode action', () => {
      // given
      // ... there is a circuit board with nodes in state
      // ... the selectNode action is dispatched
      const state = { circuitBoard: DEFAULT_CIRCUIT_BOARD }
      const action = selectNode (2)

      // when ... we select a node

      // then
      // ... should set the selected node id
      // ... and should set the selected chip id
    })
  })
})
