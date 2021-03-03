import React, { useRef, useEffect, useState } from 'react'
import { select, transition, easeLinear } from 'd3'
import {
  find,
  propEq,
  filter,
  pick,
  mergeRight,
  head,
  assoc,
  compose,
  map,
  prop,
  evolve,
  nth,
  assocPath,
  path,
  zip,
} from 'ramda'
import {
  lib,
  transposeGraphAdjacencyList,
  traverseWith,
  buildVertices,
  buildEdges,
  calculateGraphLevels,
  buildGraphLevelToVertexIndexMap,
} from '@nr6/nand2tetris-logic-gates'
import * as d3 from 'd3'

import styles from './CircuitBoard.module.css'
import { SVG_HEIGHT, SVG_WIDTH, NODE_TYPE } from '../constants'
import { MODE } from '../../Mode'
import { Mode } from '../../Mode/components'

export function CircuitBoard({ mode, displaySettings }) {

  // TODO: get from state
  const [circuitBoard, setCircuitBoard] = useState ({
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
  })

  // ...
  const [graphAL, setGraphAL] = useState ()
  const [transposedGraphAL, setTransposedGraphAL] = useState ()
  const [xOffset, setXOffset] = useState (0)
  const svgRef = useRef ()
  useEffect (() => {
    const start = prop ('start') (circuitBoard)
    const end = prop ('end') (circuitBoard)
    const graphAL = compose (map (prop ('graphAL')), prop ('nodes')) (circuitBoard)
    const fs = compose (map (prop ('f')), prop ('nodes')) (circuitBoard)
    setGraphAL (graphAL)

    // calculate levels
    const graphLevels = calculateGraphLevels (start) (graphAL)
    const graphLevelToVertexIndexMap = buildGraphLevelToVertexIndexMap (graphLevels)
    const graphLevelCount = graphLevelToVertexIndexMap.length

    // transpose graph
    const transposedGraphAL = transposeGraphAdjacencyList (graphAL)
    setTransposedGraphAL (transposedGraphAL)

    // build vertices (coords) for D3
    const { hSpacing, vSpacing } = displaySettings
    const graphUIVertices = buildVertices (hSpacing) (vSpacing) (graphAL) (circuitBoard) (graphLevels) (graphLevelToVertexIndexMap)

    // build edges (coords) for D3
    const { edgeSpacing } = displaySettings
    const graphUIEdges = buildEdges (edgeSpacing) (graphUIVertices) (graphAL) (transposedGraphAL)

    // data
    let graphData = []
    const callback = (vertexIndex, inputs, outputs) => {
      graphData[vertexIndex] = { vertexIndex, inputs, outputs }
    }
    traverseWith (callback) (fs) (end) (transposedGraphAL)

    // attach data to edges
    const graphUIEdgesWithData = compose (
      map (nth (0)),
      map (x => {
        const { sourceVertexId, sourceOutputIndex } = head (x)
        return assocPath ([0, 'value']) (path ([sourceVertexId, 'outputs', sourceOutputIndex]) (graphData)) (x)
      }),
      zip (graphUIEdges),
    ) (graphData)

    // attach data to vertices
    // TODO: only associate value on INPUT and OUTPUT types
    const graphUIVerticesWithData = compose (
      map (x => {
        const id = prop ('id') (x)
        const _data = compose (pick (['label', 'type']), path (['nodes', id])) (circuitBoard)
        return mergeRight (x) (_data)
      }),
      map (nth (0)),
      map (x => assocPath ([0, 'value']) (path ([1, 'outputs', 0]) (x)) (x)),
      zip (graphUIVertices),
    ) (graphData)

    // SVG
    const svg = select (svgRef.current)

    // transitions
    const t = transition ()
      .duration (300)
      .ease (easeLinear)
    const t2 = transition ()
      .duration (100)
      .ease (easeLinear)
    const t3 = transition ()
      .delay (300)
      .duration (100)
      .ease (easeLinear)

    // d3 utils
    const line = d3.line ().context (null)
    const drawSegmentedEdge = ({ source, target }) => {
      const s1 = [source.x - newXOffset, source.y]
      const s2 = [(source.x - newXOffset) + (hSpacing / 3), source.y]
      const s3 = [(target.x - newXOffset) - (hSpacing / 3), target.y]
      const s4 = [target.x - newXOffset, target.y]
      return line ([s1, s2, s3, s4])
    }

    // calculations
    const newXOffset = (hSpacing * graphLevelCount - hSpacing) / 2

    // edges
    // TODO: draw path and translate, so that animations are not so shit
    // TODO: use a group to keep these behind vertices
    const edges = svg.selectAll ('path')
      .data (graphUIEdgesWithData)

    edges
      .join (
        enter => enter
          .append ('path')
          .attr ('class', 'path')
          .classed ('active', prop ('value'))
          .attr ('d', drawSegmentedEdge)
          .call (enter => enter.transition (t3)
            .attr ('opacity', 1),
          ),
        update => update
          .classed ('active', prop ('value'))
          .attr ('d', drawSegmentedEdge)
          .call (enter => enter.transition (t3)
            .attr ('opacity', 1),
          ),
        exit => exit
          .call (enter => enter.transition (t3)
            .attr ('opacity', 0)
            .remove (),
          ),
      )

    // all vertices
    const vertices = svg
      .selectAll ('circle')
      .data (graphUIVerticesWithData, prop ('id')) // use id instead of index to identify each vertex (from animations)

    vertices
      .join (
        enter => enter
          .append ('circle')
          .attr ('class', 'circle')
          .attr ('cx', ({ x }) => x - newXOffset)
          .attr ('cy', prop ('y'))
          .classed ('active', prop ('value'))
          .call (enter => enter.transition (t)
            .attr ('r', 10),
          ),
        update => update
          .attr ('r', 10)
          .classed ('active', prop ('value'))
          .call (update => update.transition (t)
            .attr ('cx', ({ x }) => x - newXOffset)
            .attr ('cy', prop ('y')),
          ),
        exit => exit
          .call (exit => exit.transition (t)
            .attr ('r', 0)
            .remove (),
          ),
      )
      .on ('mouseover', function (e, { type }) {
        if (mode === MODE.INTERACTIVE && type === NODE_TYPE.INPUT) {
          return select (this).classed ('hover', true)
        }
      })
      .on ('mouseout', function (e, { type }) {
        if (mode === MODE.INTERACTIVE && type === NODE_TYPE.INPUT) {
          return select (this).classed ('hover', false)
        }
      })
      .on ('mousedown', function (e, { type, id }) {
        if (mode === MODE.INTERACTIVE && type === NODE_TYPE.INPUT) {
          toggleValue (graphData) (id)
        }
      })

    // gate vertices (overlayed)
    const gateVerticesWithData = filter (({ type }) => type === NODE_TYPE.CHIP) (graphUIVerticesWithData)
    const gateVertices = svg
      .selectAll ('rect')
      .data (gateVerticesWithData, prop ('id')) // use id instead of index to identify each vertex (from animations)

    // TODO: move to display settings
    const rectSize = 40

    gateVertices
      .join (
        enter => enter
          .append ('rect')
          .attr ('class', 'rect')
          .attr ('width', rectSize)
          .attr ('height', rectSize)
          .attr ('x', ({ x }) => x - (rectSize / 2) - newXOffset)
          .attr ('y', ({ y }) => y - (rectSize / 2))
          .classed ('active', prop ('value'))
          .call (enter => enter.transition (t)
            .attr ('r', 10),
          ),
        update => update
          .classed ('active', prop ('value'))
          .call (update => update.transition (t)
            .attr ('x', ({ x }) => x - (rectSize / 2) - newXOffset)
            .attr ('y', ({ y }) => y - (rectSize / 2)),
          ),
        exit => exit
          .call (exit => exit.transition (t)
            .attr ('x', ({ x }) => x - xOffset)
            .attr ('y', prop ('y'))
            .attr ('width', 0)
            .attr ('height', 0)
            .remove (),
          ),
      )
      .on ('mouseover', function () {
        return select (this).classed ('hover', true)
      })
      .on ('mouseout', function () {
        return select (this).classed ('hover', false)
      })
      .on ('mousedown', function (e, { id }) {
        if (mode === MODE.INTERACTIVE) {
          console.log ('SELECT NODE', id)
        }
        if (mode === MODE.UPDATE) {
          console.log ('UPDATE NODE', id)
        }
        if (mode === MODE.DELETE) {
          console.log ('DELETE NODE', id)
        }
      })

    // gate vertices text (overlayed)
    const gateVerticesText = svg
      .selectAll ('text')
      .data (gateVerticesWithData, prop ('id'))
    gateVerticesText
      .join (
        enter => enter
          .append ('text')
          .attr ('class', 'text')
          .attr ('x', ({ x }) => x - newXOffset)
          .attr ('y', ({ y }) => y)
          .attr ('dominant-baseline', 'middle')
          .attr ('text-anchor', 'middle')
          .attr ('font-size', `${(rectSize / 1.5) / 1.5}px`)
          .attr ('fill', '#fff')
          .attr ('pointer-events', 'none')
          .classed ('svgtext', true)
          .text (({ label }) => label)
          .call (exit => exit.transition (t)
            .attr ('opacity', 1),
          ),
        update => update
          .call (exit => exit.transition (t)
            .attr ('x', ({ x }) => x - newXOffset)
            .attr ('y', ({ y }) => y),
          ),
        exit => exit
          .call (exit => exit.transition (t2)
            .attr ('x', ({ x }) => x - xOffset)
            .attr ('y', ({ y }) => y)
            .attr ('opacity', 0)
            .remove (),
          ),
      )

    // ...
    setXOffset (newXOffset)
  }, [mode, circuitBoard])

  const toggleValue = graphData => id => {
    const currentValue = compose (head, prop ('outputs'), find (propEq ('vertexIndex') (id))) (graphData)
    const _data = evolve ({
      nodes: evolve ({
        [id]: x => assoc ('f') (currentValue ? lib.VALUE (false) : lib.VALUE (true)) (x),
      }),
    }) (circuitBoard)
    setCircuitBoard (_data)
  }

  return (
    <div className={styles.svgContainer}>
      <Mode />
      <svg
        preserveAspectRatio="xMinYMin meet"
        viewBox={[-SVG_WIDTH / 2, -SVG_HEIGHT / 2, SVG_WIDTH, SVG_HEIGHT]}
        className="svg-content-main"
        ref={svgRef}
      >
      </svg>
    </div>
  )
}

