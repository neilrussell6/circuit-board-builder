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
import { NODE_TYPE } from '../constants'
import { MODE } from '../../Mode'
import { removeNodeFromCircuitBoard } from '../circuit-board.utils'
import { CircuitBoardNodes } from '../CircuitBoardNodes/CircuitBoardNodes'
import { Mode } from '../../Mode/components'

// TODO: this is a hack cause onNodeClick is not seeing the updated value of mode (hopefully this is solved when we get it from redux state, otherwise figure out why this is happening)
let _mode = MODE.INTERACTIVE

export function CircuitBoard({
  displaySettings,
  circuitBoard: stateCircuitBoard,
  selectNode,
  updateNode,
  deleteNode,
}) {
  const [circuitBoard, setCircuitBoard] = useState (stateCircuitBoard)
  useEffect (() => {
    setCircuitBoard (stateCircuitBoard)
  }, [stateCircuitBoard])

  // TODO: solve this hack
  const _setMode = x => {
    _mode = x
  }

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
        toggleValue (value) (id)
      }
      if (type === NODE_TYPE.CHIP) {
        selectNode (id)
      }
    }
    if (_mode === MODE.UPDATE) {
      updateNode (id)
    }
    if (type === NODE_TYPE.CHIP && _mode === MODE.DELETE) {
      deleteNode (id)
      removeGate (id)
    }
  }

  const removeGate = (id) => {
    const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
    const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)
    const _circuitBoard = removeNodeFromCircuitBoard (id) (levels) (circuitBoard)
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
      <Mode onChange={(x) => _setMode(x)} />
      <div className={join (' ') ([styles.NodesContainer, _mode])}>
        {isNil (graphData) ? null : (
          <CircuitBoardNodes
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
