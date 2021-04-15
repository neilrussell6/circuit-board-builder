import React from 'react'

import styles from './Mode.module.css'
import { MODE } from '../mode.constants'

export const Mode = ({ mode, setMode }) => (
  <div className={styles.modeButtonGroup}>
    MODE:
    <button className={(mode === MODE.SELECT) ? styles.buttonSelected : styles.button}
            onClick={() => setMode (MODE.SELECT)}>SELECT</button>
    <button className={(mode === MODE.INTERACTIVE) ? styles.buttonSelected : styles.button}
            onClick={() => setMode (MODE.INTERACTIVE)}>INTERACTIVE
    </button>
    <button className={(mode === MODE.UPDATE) ? styles.buttonSelected : styles.button}
            onClick={() => setMode (MODE.UPDATE)}>UPDATE
    </button>
    <button className={(mode === MODE.DELETE) ? styles.buttonSelected : styles.button}
            onClick={() => setMode (MODE.DELETE)}>DELETE
    </button>
  </div>
)
