import React, { useRef, useEffect, useState } from 'react'

import styles from './Chips.module.css'

export const Chip = ({ name, onClick, isSelected }) => {
  return (
    <div className={isSelected ? styles.selectedChip : styles.chip} onClick={onClick}>
      <text>{name}</text>
    </div>
  )
}

export const Chips = ({ selectedChip, chips, selectChip }) => {
  return (
    <div>
      <div className={styles.header}>Chips</div>
      {chips.map((chip) => (
        <Chip name={chip.name} onClick={() => selectChip(chip.id)} isSelected={(selectedChip === chip.id)}/>
      ))}
    </div>
  )
}
