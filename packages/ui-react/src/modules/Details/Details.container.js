import { connect } from 'react-redux'

import { Details } from './Details'
import { selector } from './selectors'

const mapStateToProps = selector

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(Details)
