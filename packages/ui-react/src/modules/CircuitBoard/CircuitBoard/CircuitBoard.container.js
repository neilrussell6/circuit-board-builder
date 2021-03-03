import { connect } from 'react-redux'

import { CircuitBoard as CircuitBoardComponent } from './CircuitBoard'
import { CircuitBoardSelector } from './CircuitBoard.selectors'

const mapStateToProps = CircuitBoardSelector

const mapDispatchToProps = null

export const CircuitBoard = connect (mapStateToProps, mapDispatchToProps) (CircuitBoardComponent)
