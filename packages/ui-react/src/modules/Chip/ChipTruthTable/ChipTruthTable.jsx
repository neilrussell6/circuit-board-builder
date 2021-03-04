import React from 'react'
import { map, addIndex } from 'ramda'

import styles from './ChipTruthTable.module.css'

export const ChipTruthTable = ({ truthTable }) => {
  const mapIndexed = addIndex (map)
  const headers = truthTable[0]
  const values = truthTable.slice(1)
  return (
    <table className={styles.truthTable}>
      <thead>
        <tr key="tr">
        {
          mapIndexed ((val, index) => (<td className={styles.truthTableHeader} key={`th_${index}`}>{val}</td>)) (headers)
        }
        </tr>
      </thead>
      <tbody className={styles.tbody}>
      { mapIndexed (
          (row, rowIndex) => (
            <tr key={`tr_${rowIndex}`}>
              { mapIndexed (
                (val, colIndex) => (<td className={styles.truthTableCell} key={`td_${rowIndex}_${colIndex}`}>{val}</td>)
              ) (row) }
            </tr>
          )
        ) (values)
      }
      </tbody>
    </table>
  )
}
