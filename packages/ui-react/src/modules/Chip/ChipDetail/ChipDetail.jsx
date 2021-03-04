import React from 'react'

import styles from './ChipDetail.module.css'
import { ChipTruthTable } from '../ChipTruthTable/ChipTruthTable'

export const ChipDetail = ({ chip }) => {
  const { id, name, description, truthTable, inputs, outputs } = chip
  return (
    <div className={styles.container}>
      <div className={styles.header}>{name}</div>
      <div className={styles.description}>{description}</div>

      {(truthTable.length > 0) &&
        <div className={styles.truthTable}>
          <ChipTruthTable truthTable={truthTable} />
        </div>
      }
    </div>
  )
}
