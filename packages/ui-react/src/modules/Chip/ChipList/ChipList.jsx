import React, { useState, useEffect } from 'react'
import {findIndex, map, propEq} from 'ramda'

import styles from './ChipList.module.css'
import { ChipDetail } from '../components'

export const ChipSummary = ({ name, onClick, isSelected }) => (
  <div className={isSelected ? styles.selectedChip : styles.chip} onClick={onClick}>
    {name}
  </div>
)

export const ChipList = ({ viewedChipId, chips, onClick, onHover, showChips }) => {
  const [slideOutIsOpen, setSlideOutIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if ( showChips ) {
      setTimeout (() => setIsVisible(true), 200)
    } else {
      setIsVisible (false)
    }
  }, [showChips])

  useEffect(() => {
    if (viewedChipId === 0) {
      closeSlideOut()
    } else {
      openSlideOut()
    }
  }, [viewedChipId])

  const openSlideOut = () => {
    setSlideOutIsOpen(true)
  }

  const closeSlideOut = () => {
    setSlideOutIsOpen(false)
  }

  const viewedChipIndex = findIndex (propEq ('id') (viewedChipId)) (chips)
  const baseOffset = 69
  const slideOutOffset = (viewedChipIndex * 52) + baseOffset

  if (!isVisible) return null

  return (
    <div>
      <div className={styles.header}>Chips</div>
      {map (({ id, name }) => (
        <ChipSummary key={id} name={name} onClick={() => onHover(id)} isSelected={(viewedChipId === id)} />
      )) (chips)}

      {slideOutIsOpen &&
        <div className={styles.detailsContainer} style={{ top: slideOutOffset }}>
          <button title="close" onClick={closeSlideOut} className={styles.close}>x</button>
          <ChipDetail />
        </div>
      }
    </div>
  )
}
