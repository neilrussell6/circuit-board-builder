import { connect } from 'react-redux'

import { ChipDetail as ChipDetailComponent } from './ChipDetail'
import { ChipDetailSelector } from './ChipDetail.selectors'

const mapStateToProps = ChipDetailSelector

const mapDispatchToProps = null

export const ChipDetail = connect (mapStateToProps, mapDispatchToProps) (ChipDetailComponent)
