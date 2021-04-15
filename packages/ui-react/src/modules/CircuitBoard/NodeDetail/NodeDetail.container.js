import { connect } from 'react-redux'

import { NodeDetail as NodeDetailComponent } from './NodeDetail'
import { NodeDetailSelector } from './NodeDetail.selectors'

const mapStateToProps = NodeDetailSelector

const mapDispatchToProps = null

export const NodeDetail = connect (mapStateToProps, mapDispatchToProps) (NodeDetailComponent)
