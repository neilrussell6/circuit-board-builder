import React, { useEffect, useState } from 'react'
import {
  join,
  assoc,
  compose,
  map,
  prop,
  evolve,
  isNil,
  invert,
  values,
} from 'ramda'
import {
  lib,
  transposeGraphAdjacencyList,
  traverseWith,
  calculateGraphLevels,
  sortGraphLevelToVertexIdMap,
} from '@nr6/nand2tetris-logic-gates'

import styles from './CircuitBoard.module.css'
import { NODE_TYPE } from './constants'
import { MODE } from '../App'
import { removeNodeFromCircuitBoard } from './circuit-board.utils'
import { CircuitBoardNodes } from './CircuitBoardNodes/CircuitBoardNodes'

// TODO: get from state
const displaySettings = {
  vspacing: 50,
  hspacing: 120,
  edgeThickness: 1.4,
  edgeSpacing: 5,
  size: 20,
  rectSize: 40,
}

// TODO: this is a hack cause onNodeClick is not seeing the updated value of mode (hopefully this is solved when we get it from redux state, otherwise figure out why this is happening)
let _mode = MODE.INTERACTIVE

export function CircuitBoard() {
// TODO: get from state
  const [mode, setMode] = useState (MODE.INTERACTIVE)
  const _setMode = x => {
    _mode = x
    setMode (x)
  }

  const [selectedView, setSelectedView] = useState (10)
  const viewOptions = [
    { value: 0, label: '2 gates (2 inputs and 1 output)' },
    { value: 1, label: '1 gate (2 inputs and 1 output)' },
    { value: 2, label: '2 gates (same inputs and separate outputs)' },
    { value: 3, label: '3 gates 1' },
    { value: 4, label: '3 gates 2' },
    { value: 5, label: '3 gates 3' },
    { value: 6, label: '6 gates (3 and 3 in series) 1' },
    { value: 7, label: '6 gates (3 and 3 in series) 2' },
    { value: 8, label: '6 gates (3 and 3 in series) 3' },
    { value: 9, label: '3 gates (in series)' },
    { value: 10, label: '3 gates (in series)' },
  ]

  let views = {}

  views[0] = {
    start: ['A', 'B'],
    end: ['E'],
    nodes: {
      'A': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['C', 0, 0]],
        f: lib.VALUE (true),
      },
      'B': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['C', 0, 1]],
        f: lib.VALUE (false),
      },
      'C': {
        chipId: '1',
        label: 'AND',
        type: NODE_TYPE.CHIP,
        graphAL: [['D', 0, 0]],
        f: lib.AND,
      },
      'D': {
        chipId: null,
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['E', 0, 0]],
        f: lib.NOT,
      },
      'E': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 1 gate (2 inputs and 1 output)
  views[1] = {
    start: ['A', 'B'],
    end: ['D'],
    nodes: {
      'A': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['C', 0, 0]],
        f: lib.VALUE (true),
      },
      'B': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['C', 0, 1]],
        f: lib.VALUE (false),
      },
      'C': {
        chipId: '1',
        label: 'AND',
        type: NODE_TYPE.CHIP,
        graphAL: [['D', 0, 0]],
        f: lib.AND,
      },
      'D': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 2 gates (same inputs and separate outputs)
  views[2] = {
    start: ['IN1', 'IN2'],
    end: ['OUT1', 'OUT2'],
    nodes: {
      'IN1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['GATE1', 0, 0], ['GATE2', 0, 0]],
        f: lib.VALUE (true),
      },
      'IN2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['GATE1', 0, 1], ['GATE2', 0, 1]],
        f: lib.VALUE (false),
      },
      'GATE1': {
        chipId: '1',
        label: 'AND',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT1', 0, 0]],
        f: lib.AND,
      },
      'GATE2': {
        chipId: '2',
        label: 'OR',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT2', 0, 0]],
        f: lib.OR,
      },
      'OUT1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
      'OUT2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 3 gates
  views[3] = {
    start: ['0', '1', '3'],
    end: ['6', '7'],
    nodes: {
      '0': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['2', 0, 0]],
        f: lib.VALUE (true),
      },
      '1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['2', 0, 1]],
        f: lib.VALUE (false),
      },
      '2': {
        chipId: '1',
        label: 'AND',
        type: NODE_TYPE.CHIP,
        graphAL: [['5', 0, 0]],
        f: lib.AND,
      },
      '3': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['4', 0, 0]],
        f: lib.VALUE (true),
      },
      '4': {
        chipId: '2',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['5', 0, 1]],
        f: lib.NOT,
      },
      '5': {
        chipId: '3',
        label: 'OR',
        type: NODE_TYPE.CHIP,
        graphAL: [['6', 0, 0], ['7', 0, 0]],
        f: lib.OR,
      },
      '6': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
      '7': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 3 gates
  views[4] = {
    start: ['0', '3'],
    end: ['6'],
    nodes: {
      '0': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['2', 0, 0]],
        f: lib.VALUE (true),
      },
      '2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['5', 0, 0]],
        f: lib.ID,
      },
      '3': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['4', 0, 0]],
        f: lib.VALUE (true),
      },
      '4': {
        chipId: '2',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['5', 0, 1]],
        f: lib.NOT,
      },
      '5': {
        chipId: '3',
        label: 'OR',
        type: NODE_TYPE.CHIP,
        graphAL: [['6', 0, 0]],
        f: lib.OR,
      },
      '6': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 3 gates
  views[5] = {
    start: ['0', '1'],
    end: ['6'],
    nodes: {
      '0': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['2', 0, 0]],
        f: lib.VALUE (true),
      },
      '1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['3', 0, 0]],
        f: lib.VALUE (false),
      },
      '2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['5', 0, 0]],
        f: lib.ID,
      },
      '3': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['5', 0, 1]],
        f: lib.ID,
      },
      '5': {
        chipId: '3',
        label: 'OR',
        type: NODE_TYPE.CHIP,
        graphAL: [['6', 0, 0]],
        f: lib.OR,
      },
      '6': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 6 gates (3 and 3 in series)
  views[6] = {
    start: ['IN1', 'IN2'],
    end: ['OUT1', 'OUT2'],
    nodes: {
      'IN1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['A', 0, 0]],
        f: lib.VALUE (true),
      },
      'A': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['B', 0, 0]],
        f: lib.NOT,
      },
      'B': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT1', 0, 0]],
        f: lib.NOT,
      },
      // 'C': {
      //   chipId: '1',
      //   label: 'NOT',
      //   type: NODE_TYPE.CHIP,
      //   graphAL: [['OUT1', 0, 0]],
      //   f: lib.NOT,
      // },
      'OUT1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
      'IN2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['D', 0, 0]],
        f: lib.VALUE (true),
      },
      'D': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['E', 0, 0]],
        f: lib.NOT,
      },
      'E': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT2', 0, 0]],
        f: lib.NOT,
      },
      // 'F': {
      //   chipId: '1',
      //   label: 'NOT',
      //   type: NODE_TYPE.CHIP,
      //   graphAL: [['OUT2', 0, 0]],
      //   f: lib.NOT,
      // },
      'OUT2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 6 gates (3 and 3 in series)
  views[7] = {
    start: ['IN1', 'IN2'],
    end: ['OUT1', 'OUT2'],
    nodes: {
      'IN1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['A', 0, 0]],
        f: lib.VALUE (true),
      },
      'A': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['B', 0, 0]],
        f: lib.NOT,
      },
      'B': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['C', 0, 0]],
        f: lib.NOT,
      },
      'C': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.EXTENSION,
        graphAL: [['OUT1', 0, 0]],
        f: lib.ID,
      },
      'OUT1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
      'IN2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['D', 0, 0]],
        f: lib.VALUE (true),
      },
      'D': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['E', 0, 0]],
        f: lib.NOT,
      },
      'E': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['F', 0, 0]],
        f: lib.NOT,
      },
      'F': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT2', 0, 0]],
        f: lib.NOT,
      },
      'OUT2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // 6 gates (3 and 3 in series) 2
  views[8] = {
    start: ['UPPER_IN', 'LOWER_IN'],
    end: ['LOWER_OUT', 'NEW1'],
    nodes: {
      'UPPER_IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['UPPER_GATE1', 0, 0]], label: 'X', f: lib.ID },
      'UPPER_GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['UPPER_GATE2', 0, 0]], label: 'X', f: lib.ID },
      'UPPER_GATE2': { chipId: '2', type: NODE_TYPE.CHIP, graphAL: [['NEW2', 0, 0]], label: 'X', f: lib.ID },
      'LOWER_IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['LOWER_GATE1', 0, 0]], label: 'X', f: lib.ID },
      'LOWER_GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['LOWER_GATE2', 0, 0]], label: 'X', f: lib.ID },
      'LOWER_GATE2': { chipId: '2', type: NODE_TYPE.CHIP, graphAL: [['LOWER_GATE3', 0, 0]], label: 'X', f: lib.ID },
      'LOWER_GATE3': { chipId: '3', type: NODE_TYPE.CHIP, graphAL: [['LOWER_OUT', 0, 0]],  label: 'X', f: lib.ID },
      'LOWER_OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [], label: 'X', f: lib.ID },
      'NEW1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [], label: 'X', f: lib.ID },
      'NEW2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['NEW1', 0, 0]], label: 'X', f: lib.ID },
    },
  }

  // 3 gates (in series)
  views[9] = {
    start: ['IN'],
    end: ['OUT'],
    nodes: {
      'IN': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['A', 0, 0]],
        f: lib.VALUE (true),
      },
      'A': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['B', 0, 0]],
        f: lib.NOT,
      },
      'B': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['C', 0, 0]],
        f: lib.NOT,
      },
      'C': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT', 0, 0]],
        f: lib.NOT,
      },
      'OUT': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  // (IN1) 0 -- 0 (GATE1)   0 -- 0
  //                             +-- (GATE2) 0 -- 0 (GATE4) 0 -- 0 (OUT1)
  //                        0 -- 1
  // (IN2) 0 -- 0 (SPLT1) --+
  //                        1 -- 0
  //                             +-- (GATE3) 0 -- 0 (EXT2)  0 -- 0 (OUT2)
  // (IN3) 0 -- 0  (EXT1)   0 -- 1
  // 3 gates (in series)
  views[10] = {
    start: ['IN1', 'IN2', 'IN3'],
    end: ['OUT1', 'OUT2'],
    nodes: {
      'IN1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['XOR', 0, 0]],
        f: lib.VALUE (true),
      },
      'IN2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['SPLIT1', 0, 0]],
        f: lib.VALUE (true),
      },
      'IN3': {
        chipId: null,
        label: '',
        type: NODE_TYPE.INPUT,
        graphAL: [['EXT1', 0, 0]],
        f: lib.VALUE (true),
      },
      'XOR': {
        chipId: '1',
        label: 'XOR',
        type: NODE_TYPE.CHIP,
        graphAL: [['OR', 0, 0]],
        f: lib.XOR,
      },
      'SPLIT1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.SPLITTER,
        graphAL: [['OR', 0, 1], ['NAND', 0, 0]],
        f: lib.ID,
      },
      'EXT1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.EXTENSION,
        graphAL: [['NAND', 0, 1]],
        f: lib.ID,
      },
      'OR': {
        chipId: '1',
        label: 'OR',
        type: NODE_TYPE.CHIP,
        graphAL: [['NOT', 0, 0]],
        f: lib.OR,
      },
      'NAND': {
        chipId: '1',
        label: 'NAND',
        type: NODE_TYPE.CHIP,
        graphAL: [['EXT2', 0, 0]],
        f: lib.NAND,
      },
      'NOT': {
        chipId: '1',
        label: 'NOT',
        type: NODE_TYPE.CHIP,
        graphAL: [['OUT1', 0, 0]],
        f: lib.NOT,
      },
      'EXT2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.EXTENSION,
        graphAL: [['OUT2', 0, 0]],
        f: lib.ID,
      },
      'OUT1': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
      'OUT2': {
        chipId: null,
        label: '',
        type: NODE_TYPE.OUTPUT,
        graphAL: [],
        f: lib.ID,
      },
    },
  }

  const [circuitBoard, setCircuitBoard] = useState (prop (selectedView) (views))
  useEffect(() => {
    setCircuitBoard (prop (selectedView) (views))
  }, [selectedView])

  // ...
  const [graphData, setGraphData] = useState ()
  useEffect (() => {
    const start = prop ('start') (circuitBoard)
    const end = prop ('end') (circuitBoard)
    const graphAL = compose (map (prop ('graphAL')), prop ('nodes')) (circuitBoard)
    const fs = compose (map (prop ('f')), prop ('nodes')) (circuitBoard)

    // calculate levels
    const graphLevels = calculateGraphLevels (start) (graphAL)
    const graphLevelToVertexIndexMap = compose (sortGraphLevelToVertexIdMap (graphAL), values, invert) (graphLevels)
    const graphLevelCount = graphLevelToVertexIndexMap.length

    // transpose graph
    const transposedGraphAL = transposeGraphAdjacencyList (graphAL)

    // data
    let _graphData = []
    const callback = (vertexId, inputs, outputs) => {
      _graphData[vertexId] = { vertexId, inputs, outputs }
    }
    traverseWith (callback) (fs) (end) (transposedGraphAL) // TODO: replace with bfs or bfsLevels?
    setGraphData ({
      // levels
      graphLevels,
      graphLevelToVertexIndexMap,
      graphLevelCount,
      // AL
      graphAL,
      transposedGraphAL,
      // data
      graphData: _graphData,
    })
  }, [circuitBoard])

  const onNodeClick = ({ type, id, value }) => {
    if (_mode === MODE.INTERACTIVE) {
      if (type === NODE_TYPE.INPUT) {
        console.log ('SELECT NODE', id)
        toggleValue (value) (id)
      }
    }
    if (_mode === MODE.UPDATE) {
      console.log ('UPDATE NODE', id)
    }
    if (type === NODE_TYPE.CHIP && _mode === MODE.DELETE) {
      console.log ('DELETE NODE', id)
      removeGate (id)
    }
  }

  const removeGate = (id) => {
    // const { graphAL, transposedGraphAL } = graphData
    const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
    const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)
    const _circuitBoard = removeNodeFromCircuitBoard (id)  (levels) (circuitBoard)
    setCircuitBoard (_circuitBoard)
  }

  const toggleValue = currentValue => id => {
    const _data = evolve ({
      nodes: evolve ({
        [id]: x => assoc ('f') (currentValue ? lib.VALUE (false) : lib.VALUE (true)) (x),
      }),
    }) (circuitBoard)
    setCircuitBoard (_data)
  }

  return (
    <div className={styles.container}>
      {/* TODO: move to dedicated component */}
      <div className={styles.modeButtonGroup}>
        MODE:
        <button className={styles.button} onClick={() => _setMode (MODE.INTERACTIVE)}>INTERACTIVE</button>
        <button className={styles.button} onClick={() => _setMode (MODE.UPDATE)}>UPDATE</button>
        <button className={styles.button} onClick={() => _setMode (MODE.DELETE)}>DELETE</button>
        <select value={selectedView} onChange={e => setSelectedView(e.target.value)}>
          {map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))(viewOptions)}
        </select>
      </div>
      <div className={join (' ') ([styles.NodesContainer, mode])}>
        {isNil(graphData) ? null : (
          <CircuitBoardNodes
            mode={mode}
            displaySettings={displaySettings}
            circuitBoard={circuitBoard}
            data={graphData}
            onClick={onNodeClick}
          />
        )}
      </div>
    </div>
  )
}

