import { connect } from 'react-redux'

import { CircuitBoard as CircuitBoardComponent } from './CircuitBoard'
import { CircuitBoardSelector } from './CircuitBoard.selectors'
import { setCircuitBoard } from '../circuitBoard.reducer'

const mapStateToProps = CircuitBoardSelector

const mapDispatchToProps = dispatch => ({
  setCircuitBoard: circuitBoard => dispatch (setCircuitBoard (circuitBoard))
})

export const CircuitBoard = connect (mapStateToProps, mapDispatchToProps) (CircuitBoardComponent)
