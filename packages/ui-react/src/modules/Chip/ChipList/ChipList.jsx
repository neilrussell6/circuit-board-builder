import React, { useState } from 'react'
import { map } from 'ramda'
import SlideOut from '@ijsto/react-slideout'

import styles from './ChipList.module.css'
import { ChipDetail } from '../components'

export const ChipSummary = ({ name, onClick, isSelected }) => (
  <div className={isSelected ? styles.selectedChipId : styles.chip} onClick={onClick}>
    {name}
  </div>
)

export const ChipList = ({ selectedChipId, chips, onSelect }) => {
  const [slideOutIsOpen, setSlideOutIsOpen] = useState(false)

  const openSlideOut = () => {
    setSlideOutIsOpen(true)
  }

  const closeSlideOut = () => {
    setSlideOutIsOpen(false)
  }

  const selectChip = (id) => {
    onSelect(id)
    openSlideOut()
  }

  return  (
    <div>
      <div className={styles.header}>Chips</div>
      {map (({ id, name }) => (
        <ChipSummary key={id} name={name} onClick={() => selectChip(id)} isSelected={(selectedChipId === id)} />
      )) (chips)}

      <SlideOut
        closeComponent={<button onClick={closeSlideOut} title="close" className={styles.close}>x</button> }
        isOpen={slideOutIsOpen && selectedChipId > 0}
        onClose={closeSlideOut}
        offsetTop="0"
        overlayOpacity="0"
        style={{ backgroundColor: 'var(--panel1-bg-color)' }}
      >
        <ChipDetail />
      </SlideOut>
    </div>
  )
}
