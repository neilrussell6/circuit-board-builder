import { connect } from 'react-redux'

import { Mode as ModeComponent } from './Mode'
import { ModeSelector } from './Mode.selectors'
import { setMode } from '../mode.reducer'

const mapStateToProps = ModeSelector

const mapDispatchToProps = (dispatch, { onChange }) => ({
  setMode: mode => {
    dispatch (setMode (mode))
    onChange (mode)
  },
})

export const Mode = connect (mapStateToProps, mapDispatchToProps) (ModeComponent)
