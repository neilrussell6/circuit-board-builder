import { connect } from 'react-redux'

import { Chips } from './Chips'
import { selector } from './selectors'
import { setSelectedChipId } from '../App/selectedChipId.reducer'

const mapStateToProps = selector

const mapDispatchToProps = (dispatch) => ({
  selectChip: (chipId) => dispatch(setSelectedChipId(chipId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chips)
