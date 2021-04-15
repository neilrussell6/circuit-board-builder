import { connect } from 'react-redux'

import { ChipList as ChipListComponent } from './ChipList'
import { ChipListSelector } from './ChipList.selectors'
import { setViewedChipId } from '../viewedChipId.reducer'
import { setClickedChipId } from '../clickedChipId.reducer'

const mapStateToProps = ChipListSelector

const mapDispatchToProps = dispatch => ({
  onClick: chipId => {
    dispatch (setClickedChipId (chipId))
  },
  onHover: chipId => {
    dispatch (setViewedChipId (chipId))
  },
})

export const ChipList = connect (mapStateToProps, mapDispatchToProps) (ChipListComponent)
