import React from 'react'

import styles from './Chips.module.css'

export const Chip = ({ name, onClick, isSelected }) => {
  return (
    <div className={isSelected ? styles.selectedChipId : styles.chip} onClick={onClick}>
      <text>{name}</text>
    </div>
  )
}

export const Chips = ({ selectedChipId, chips, selectChip }) => {
  return (
    <div>
      <div className={styles.header}>Chips</div>
      {chips.map((chip) => (
        <Chip name={chip.name} onClick={() => selectChip(chip.id)} isSelected={(selectedChipId === chip.id)}/>
      ))}
    </div>
  )
}
