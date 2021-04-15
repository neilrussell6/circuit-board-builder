import { connect } from 'react-redux'

import { CircuitBoard as CircuitBoardComponent } from './CircuitBoard'
import { CircuitBoardSelector } from './CircuitBoard.selectors'
import { setCircuitBoard, updateNode, deleteNode } from '../circuitBoard.reducer'
import { setSelectedNodeId } from '../selectedNodeId.reducer'

const mapStateToProps = CircuitBoardSelector

const mapDispatchToProps = dispatch => ({
  setCircuitBoard: circuitBoard => dispatch (setCircuitBoard (circuitBoard)),
  selectNode: nodeId => dispatch (setSelectedNodeId (nodeId)),
  updateNode: nodeId => dispatch (updateNode (nodeId)),
  deleteNode: nodeId => dispatch (deleteNode (nodeId)),
})

export const CircuitBoard = connect (mapStateToProps, mapDispatchToProps) (CircuitBoardComponent)
