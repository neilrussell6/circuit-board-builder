import React from 'react'

import styles from './ChipDetail.module.css'

export const ChipDetail = ({ chip }) => {
  const { id, name, description, truthTable, inputs, outputs } = chip
  return (
    <div>
      <div className={styles.header}>{name}</div>
      <div className={styles.description}>{description}</div>
    </div>
  )
}
