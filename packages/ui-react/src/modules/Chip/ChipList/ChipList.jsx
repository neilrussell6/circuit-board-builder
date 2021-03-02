import React from 'react'
import { map } from 'ramda'

import styles from './ChipList.module.css'

export const ChipSummary = ({ name, onClick, isSelected }) => (
  <div className={isSelected ? styles.selectedChipId : styles.chip} onClick={onClick}>
    {name}
  </div>
)

export const ChipList = ({ selectedChipId, chips, onSelect }) => (
  <div>
    <div className={styles.header}>Chips</div>
    {map (({ id, name }) => (
      <ChipSummary key={id} name={name} onClick={() => onSelect(id)} isSelected={(selectedChipId === id)} />
    )) (chips)}
  </div>
)
