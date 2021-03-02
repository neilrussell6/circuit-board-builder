import { connect } from 'react-redux'

import { ChipDetail as ChipDetailComponent } from './ChipDetail'
import { ChipDetailSelector } from './ChipDetails.selectors'

const mapStateToProps = ChipDetailSelector

const mapDispatchToProps = null

export const ChipDetail = connect (mapStateToProps, mapDispatchToProps) (ChipDetailComponent)
