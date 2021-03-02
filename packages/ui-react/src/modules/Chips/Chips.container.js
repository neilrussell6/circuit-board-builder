import { connect } from 'react-redux'

import { Chips } from './Chips'
import { selector } from './selectors'
import { setSelectedChip } from '../App/selectedChip.reducer'

const mapStateToProps = selector

const mapDispatchToProps = (dispatch) => ({
  selectChip: (chipId) => dispatch(setSelectedChip(chipId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chips)
