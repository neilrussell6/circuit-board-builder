import React, {useEffect, useState} from 'react'

import styles from './NodeDetail.module.css'

export const NodeDetail = ({ node, showDetails }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { label } = node

  useEffect(() => {
    if ( showDetails ) {
      setTimeout (() => setIsVisible(true), 200)
    } else {
      setIsVisible (false)
    }
  }, [showDetails])

  if (!isVisible) return null

  return (
    <div>
      <div className={styles.header}>{label}</div>
    </div>
  )
}
