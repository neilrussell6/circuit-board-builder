import { connect } from 'react-redux'

import { ChipDetail } from './ChipDetail'
import { selector } from './selectors'

const mapStateToProps = selector

const mapDispatchToProps = null

export const ChipDetail = connect (mapStateToProps, mapDispatchToProps) (ChipDetail)
