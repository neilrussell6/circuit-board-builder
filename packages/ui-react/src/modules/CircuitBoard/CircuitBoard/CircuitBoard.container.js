import { connect } from 'react-redux'

import { CircuitBoard as CircuitBoardComponent } from './CircuitBoard'
import { CircuitBoardSelector } from './CircuitBoard.selectors'
import { setMode } from '../../Mode'

const mapStateToProps = CircuitBoardSelector

const mapDispatchToProps = (dispatch) => ({
  setMode: mode => dispatch (setMode (mode))
})

export const CircuitBoard = connect (mapStateToProps, mapDispatchToProps) (CircuitBoardComponent)
