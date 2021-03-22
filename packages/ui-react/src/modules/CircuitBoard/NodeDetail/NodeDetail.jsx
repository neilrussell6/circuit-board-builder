import React, {useEffect, useState} from 'react'

import styles from './NodeDetail.module.css'
import { NodeTruthTable } from '../NodeTruthTable/NodeTruthTable'

export const NodeDetail = ({ node, chip, showDetails }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { label } = node
  const { description, truthTable } = chip

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
      <div className={styles.description}>{description}</div>

      {(truthTable.length > 0) &&
      <div className={styles.truthTable}>
        <NodeTruthTable truthTable={truthTable} />
      </div>
      }
    </div>
  )
}
