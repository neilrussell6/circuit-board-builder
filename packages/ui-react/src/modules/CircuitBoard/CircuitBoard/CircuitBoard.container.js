import { connect } from 'react-redux'

import { CircuitBoard as CircuitBoardComponent } from './CircuitBoard'
import { CircuitBoardSelector } from './CircuitBoard.selectors'
import { setCircuitBoard, selectNode, updateNode, deleteNode } from '../circuitBoard.reducer'

const mapStateToProps = CircuitBoardSelector

const mapDispatchToProps = dispatch => ({
  setCircuitBoard: circuitBoard => dispatch (setCircuitBoard (circuitBoard)),
  selectNode: nodeId => dispatch (selectNode (nodeId)),
  updateNode: nodeId => dispatch (updateNode (nodeId)),
  deleteNode: nodeId => dispatch (deleteNode (nodeId)),
})

export const CircuitBoard = connect (mapStateToProps, mapDispatchToProps) (CircuitBoardComponent)
