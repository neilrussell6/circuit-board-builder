import React, { useState } from 'react'
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg'

import styles from './App.module.css'
import { CircuitBoard } from '../CircuitBoard/components'
import { ChipList } from '../Chip/components'
import { NodeDetail } from '../CircuitBoard/components'

export function App() {
  const [isLeft, setIsLeft] = useState (true)
  const [isRight, setIsRight] = useState (true)

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.row}>

          {/* left */}
          <div className={[isLeft ? styles.col : styles.colMin, styles.colLeft].join (' ')}>
            <button onClick={() => setIsLeft (isLeft ? false : true)}
                    className={[styles.button, styles.right].join (' ')}>
              {isLeft ? <CgChevronDoubleLeft/> : <CgChevronDoubleRight/>}
            </button>
            <ChipList showChips={isLeft} />
          </div>

          {/* center */}
          <div className={styles.colCenter}>
            <CircuitBoard />
          </div>

          {/* right */}
          <div className={[isRight ? styles.col : styles.colMin, styles.colRight].join (' ')}>
            <button onClick={() => setIsRight (isRight ? false : true)} className={styles.button}>
              {isRight ? <CgChevronDoubleRight/> : <CgChevronDoubleLeft/>}
            </button>

            <NodeDetail showDetails={isRight}/>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>&nbsp;</footer>
    </div>
  )
}

