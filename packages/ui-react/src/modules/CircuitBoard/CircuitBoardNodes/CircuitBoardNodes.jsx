import React, { useRef, useEffect, useState } from 'react'
import { select, transition, easeLinear } from 'd3'
import {
  filter,
  prop,
} from 'ramda'
import {
  buildVertices,
  buildEdges,
} from '@nr6/nand2tetris-logic-gates'
import * as d3 from 'd3'

import styles from './CircuitBoardNodes.module.css'
import { SVG_HEIGHT, SVG_WIDTH, NODE_TYPE } from '../constants'
import {
  attachDataToGraphUIEdges,
  attachDataToGraphUIVertices,
} from '../circuit-board.utils'

export function CircuitBoardNodes ({ displaySettings, data, circuitBoard, onClick }) {
  const [xOffset, setXOffset] = useState (0)
  const svgRef = useRef ()
  const svgEdgesGroupRef = useRef ()
  const svgVerticesGroupRef = useRef ()
  useEffect (() => {
    const {
      // levels
      graphLevels,
      graphLevelToVertexIndexMap,
      graphLevelCount,
      // AL
      graphAL,
      transposedGraphAL,
      // data
      graphData,
    } = data

    // -----------------------------------------------
    // display settings
    // -----------------------------------------------

    const { hspacing, vspacing, edgeSpacing, rectSize } = displaySettings

    // -----------------------------------------------
    // vertices and edges with data
    // -----------------------------------------------

    // vertices
    const graphUIVertices = buildVertices (hspacing) (vspacing) (graphAL) (circuitBoard) (graphLevels) (graphLevelToVertexIndexMap)
    const graphUIVerticesWithData = attachDataToGraphUIVertices (graphData) (circuitBoard) (graphUIVertices)

    // edges
    const graphUIEdges = buildEdges (edgeSpacing) (graphUIVertices) (graphAL) (transposedGraphAL)
    const graphUIEdgesWithData = attachDataToGraphUIEdges (graphData) (graphUIEdges)

    // -----------------------------------------------
    // SVG & groups
    // -----------------------------------------------

    const svg = select (svgRef.current)
    const edgesGroup = select (svgEdgesGroupRef.current)
    const verticesGroup = select (svgVerticesGroupRef.current)

    // -------------------------
    // transitions
    // -------------------------

    const t = transition ()
      .duration (200)
      .ease (easeLinear)
    const td = transition ()
      .delay (200)
      .duration (300)
      .ease (easeLinear)
    const t2 = transition ()
      .duration (100)
      .ease (easeLinear)

    // -------------------------
    // utils
    // -------------------------

    const line = d3.line ().context (null)
    const drawSegmentedEdge = ({ source, target }) => {
      const s1 = [source.x - newXOffset, source.y]
      const s2 = [(source.x - newXOffset) + (hspacing / 3), source.y]
      const s3 = [(target.x - newXOffset) - (hspacing / 3), target.y]
      const s4 = [target.x - newXOffset, target.y]
      return line ([s1, s2, s3, s4])
    }

    // -------------------------
    // calculations
    // -------------------------

    const newXOffset = (hspacing * graphLevelCount - hspacing) / 2

    // -------------------------
    // edges
    // -------------------------

    // TODO: draw path and translate, so that animations are not so shit
    // TODO: use a group to keep these behind vertices
    const edges = edgesGroup.selectAll ('path')
      .data (graphUIEdgesWithData, prop ('id'))

    edges
      .join (
        enter => enter
          .append ('path')
          .attr ('class', 'path')
          .classed ('active', prop ('value'))
          .call (enter => enter.transition (t)
            .attr ('d', drawSegmentedEdge)
            .attr ('opacity', 1),
          ),
        update => update
          .classed ('active', prop ('value'))
          .call (enter => enter.transition (td)
            .attr ('d', drawSegmentedEdge),
          ),
        exit => exit
          .call (enter => enter.transition (t)
            .attr ('opacity', 0)
            .remove (),
          ),
      )

    // all vertices
    const vertices = verticesGroup
      .selectAll ('circle')
      .data (graphUIVerticesWithData, prop ('id')) // use id instead of index to identify each vertex (from animations)

    const vertexCirlceRadiusMap = {
      [NODE_TYPE.INPUT]: 10,
      [NODE_TYPE.OUTPUT]: 8,
      [NODE_TYPE.CHIP]: 5,
      [NODE_TYPE.EXTENSION]: 5,
      [NODE_TYPE.SPLITTER]: 5,
    }

    vertices
      .join (
        enter => enter
          .append ('circle')
          .attr ('class', ({ type }) => `circle ${type}`)
          .attr ('cx', ({ x }) => x - newXOffset)
          .attr ('cy', prop ('y'))
          .classed ('active', prop ('value'))
          .call (enter => enter.transition (t)
            .attr ('r', ({ type }) => prop (type) (vertexCirlceRadiusMap)),
          ),
        update => update
          .attr ('r', ({ type }) => prop (type) (vertexCirlceRadiusMap))
          .classed ('active', prop ('value'))
          .call (update => update.transition (td)
            .attr ('cx', ({ x }) => x - newXOffset)
            .attr ('cy', prop ('y')),
          ),
        exit => exit
          .call (exit => exit.transition (t)
            .attr ('r', 0)
            .remove (),
          ),
      )
      .on ('mouseover', function () {
        return select (this).classed ('hover', true)
      })
      .on ('mouseout', function () {
        return select (this).classed ('hover', false)
      })
      .on ('mousedown', (e, data) => {
        onClick (data)
      })

    // gate vertices (overlayed)
    const gateVerticesWithData = filter (({ type }) => type === NODE_TYPE.CHIP) (graphUIVerticesWithData)
    const gateVertices = verticesGroup
      .selectAll ('rect')
      .data (gateVerticesWithData, prop ('id')) // use id instead of index to identify each vertex (from animations)

    gateVertices
      .join (
        enter => enter
          .append ('rect')
          .attr ('class', 'rect chip')
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
          .call (update => update.transition (td)
            .attr ('x', ({ x }) => x - (rectSize / 2) - newXOffset)
            .attr ('y', ({ y }) => y - (rectSize / 2)),
          ),
        exit => exit
          .call (exit => exit.transition (t)
            .attr ('x', ({ x }) => x - xOffset - (rectSize / 4))
            .attr ('y', ({ y }) => y - (rectSize / 4))
            .attr ('width', rectSize / 2)
            .attr ('height', rectSize / 2)
            .remove (),
          ),
      )
      .on ('mouseover', function () {
        return select (this).classed ('hover', true)
      })
      .on ('mouseout', function () {
        return select (this).classed ('hover', false)
      })
      .on ('mousedown', (e, data) => {
        onClick (data)
      })

    // gate vertices text (overlayed)
    const gateVerticesText = verticesGroup
      .selectAll ('text')
      .data (gateVerticesWithData, prop ('id'))
    gateVerticesText
      .join (
        enter => enter
          .append ('text')
          .attr ('class', 'text chip')
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
          .call (update => update.transition (td)
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
  }, [data])

  return (
    <div className={styles.svgContainer}>
      <svg
        preserveAspectRatio="xMinYMin meet"
        viewBox={[-SVG_WIDTH / 2, -SVG_HEIGHT / 2, SVG_WIDTH, SVG_HEIGHT]}
        className="svg-content-main"
        ref={svgRef}
      >
        <g ref={svgEdgesGroupRef} />
        <g ref={svgVerticesGroupRef} />
      </svg>
    </div>
  )
}

