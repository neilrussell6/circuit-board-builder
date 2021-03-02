import { connect } from 'react-redux'

import { ChipList } from './ChipList'
import { ChipListSelector } from '../chips.selectors'
import { setSelectedChipId } from '../selectedChipId.reducer'

const mapStateToProps = ChipListSelector

const mapDispatchToProps = dispatch => ({
  onSelect: chipId => dispatch (setSelectedChipId (chipId)),
})

export const ChipList = connect (mapStateToProps, mapDispatchToProps) (ChipList)
