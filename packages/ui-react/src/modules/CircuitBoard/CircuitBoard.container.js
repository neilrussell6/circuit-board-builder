import { connect } from 'react-redux'

import { CircuitBoard } from './CircuitBoard'
import { selector } from './selectors'
import { setMode } from '../Mode/mode.reducer'

const mapStateToProps = selector

const mapDispatchToProps = (dispatch) => ({
  setMode: (mode) => dispatch(setMode(mode))
})

export default connect(mapStateToProps, mapDispatchToProps)(CircuitBoard)
