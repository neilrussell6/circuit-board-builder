import { connect } from 'react-redux'

import { ChipList as ChipListComponent } from './ChipList'
import { ChipListSelector } from './ChipList.selectors'
import { setSelectedChipId } from '../selectedChipId.reducer'

const mapStateToProps = ChipListSelector

const mapDispatchToProps = dispatch => ({
  onSelect: chipId => dispatch (setSelectedChipId (chipId)),
})

export const ChipList = connect (mapStateToProps, mapDispatchToProps) (ChipListComponent)
