import React, { useState } from 'react'
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg'

import styles from './App.module.css'
// import { CircuitBoard } from '../CircuitBoard/components'
import CircuitBoard from '../CircuitBoard'

export function App() {
  const [isLeft, setIsLeft] = useState (true)
  const [isRight, setIsRight] = useState (true)

  return (
    <div className={styles.container}>
      <header className={styles.header}>&nbsp;</header>

      <main className={styles.main}>
        <div className={styles.row}>

          {/* left */}
          <div className={[isLeft ? styles.col : styles.colMin, styles.colLeft].join (' ')}>
            <button onClick={() => setIsLeft (isLeft ? false : true)}
                    className={[styles.button, styles.right].join (' ')}>
              {isLeft ? <CgChevronDoubleLeft/> : <CgChevronDoubleRight/>}
            </button>
          </div>

          {/* center */}
          <div className={styles.colCenter}>
            <CircuitBoard/>
          </div>

          {/* right */}
          <div className={[isRight ? styles.col : styles.colMin, styles.colRight].join (' ')}>
            <button onClick={() => setIsRight (isRight ? false : true)} className={styles.button}>
              {isRight ? <CgChevronDoubleRight/> : <CgChevronDoubleLeft/>}
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>&nbsp;</footer>
    </div>
  )
}

