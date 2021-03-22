import React, { useState, useEffect } from 'react'
import {findIndex, map, propEq} from 'ramda'

import styles from './ChipList.module.css'
import { ChipDetail } from '../components'

export const ChipSummary = ({ chipId, name, onClick, onHover, isSelected }) => (
  <div
    className={isSelected ? styles.selectedChip : styles.chip}
    onClick={() => onClick(chipId)}
    onMouseOver={() => onHover(chipId)}
    onMouseOut={() => onHover(0)}
  >
    {name}
  </div>
)

export const ChipList = ({ viewedChipId, clickedChipId, chips, onClick, onHover, showChips }) => {
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
  const baseOffset = 68
  const slideOutOffset = (viewedChipIndex * 52) + baseOffset

  if (!isVisible) return null

  return (
    <div>
      <div className={styles.header}>Chips</div>
      {map (({ id, name }) => (
        <ChipSummary
          key={id}
          chipId={id}
          name={name}
          onClick={onClick}
          onHover={onHover}
          isSelected={(clickedChipId === id || viewedChipId === id)}
        />
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
