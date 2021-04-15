import { assert } from 'chai'
import parametrize from 'js-parametrize'
import {
  compose,
  map,
  prop,
  pick,
} from 'ramda'
import { calculateGraphLevels } from '@nr6/nand2tetris-logic-gates'

import { EMPTY_CIRCUIT_BOARD, NODE_TYPE } from './constants'
import * as SUT from './circuit-board.utils.js'

describe ('modules/CircuitBoard/circuit-board.utils', () => {
  describe ('removeNodeFromCircuitBoard', () => {

    // =======================================
    // SCENARIO 1 (remove)
    // =======================================

    parametrize ([
      [
        // -------------------------
        // (IN) 0 -- 0 (GATE1) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 3
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        // EMPTY
        // -------------------------
        EMPTY_CIRCUIT_BOARD,
      ],
      [
        // -------------------------
        // (IN1) 0 -- 0
        //            +-- (GATE1) 0 -- 0 (OUT)
        // (IN2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 1]] },
            // level 2
            'GATE1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['OUT', 0, 0]] },
            // level 3
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        // EMPTY
        // -------------------------
        EMPTY_CIRCUIT_BOARD,
      ],
      [
        // -------------------------
        //                       0 -- 0 (OUT1)
        // (IN) 0 -- 0 (GATE1) --+
        //                       1 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'GATE1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['OUT1', 0, 0], ['OUT1', 1, 0]] },
            // level 3
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        // EMPTY
        // -------------------------
        EMPTY_CIRCUIT_BOARD,
      ],
    ], (circuitBoard, targetId, expected) => {
      it ('should delete entire board, when we remove a node, given 0 of its ancestors or descendents are SPLITTER or CHIP types, and it is the only node on its level', () => {
        // given
        // ... 0 of it's ancestors or descendents are SPLITTER or CHIP types
        // ... and it is the only node on it's level
        const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
        const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)

        // when ... we remove a node
        const result = SUT.removeNodeFromCircuitBoard (targetId) (levels) (circuitBoard)
        // mapObjIndexed ((x, n) => console.log(n, x)) (result.nodes)

        // then ... should delete entire board
        assert.deepEqual (result.start, expected.start)
        assert.deepEqual (result.end, expected.end)
        assert.deepEqual (map (pick (['chipId', 'type', 'graphAL'])) (result.nodes), expected.nodes)
      })
    })

    parametrize ([
      [
        // -------------------------
        // (IN) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        // (IN) 0 -- 0 (GATE2) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE2', 0, 0]] },
            // level 2
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 3
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      [
        // -------------------------
        // (IN1) 0 -- 0
        //            +-- (GATE1) 0 -- 0 (GATE2) 0 -- 0 (OUT)
        // (IN2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 1]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        // (IN) 0 -- 0 (GATE2) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN1'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE2', 0, 0]] },
            // level 2
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 3
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
    ], (circuitBoard, targetId, expected) => {
      it ('should delete target node and all but 1 ancestor paths (to a board input), when we remove a node, given 0 of its ancestors are SPLITTER or CHIP types, it has only 1 output, and it is the only node on its level', () => {
        // given
        // ... 0 of its ancestors are SPLITTER or CHIP types
        // ... it has only 1 output
        // ... and it is the only node on it's level
        const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
        const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)

        // when ... we remove a node
        const result = SUT.removeNodeFromCircuitBoard (targetId) (levels) (circuitBoard)
        // mapObjIndexed ((x, n) => console.log(n, x)) (result.nodes)

        // then ... should delete target node and all parents
        assert.deepEqual (result.start, expected.start)
        assert.deepEqual (result.end, expected.end)
        assert.deepEqual (map (pick (['chipId', 'type', 'graphAL'])) (result.nodes), expected.nodes)
      })
    })

    // =======================================
    // SCENARIO 2 (replace)
    // =======================================
    //
    // parametrized scenarios
    // ------------------------------------
    //
    // single level
    // ... direct significant ancestor
    // ... ... on single ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... ... on multiple ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... distant significant ancestors on single level is not a valid state, because empty levels would have been removed
    // ... no significant ancestor
    // ... ... on single ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... ... on multiple ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    //
    // multi level
    // ... direct significant ancestor
    // ... ... on single ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... ... on multiple ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... distant significant ancestor
    // ... ... on single ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... ... on multiple ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... no significant ancestor
    // ... ... on single ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ... ... on multiple ancestor line
    // ... ... ... with single input
    // ... ... ... with multiple inputs
    // ------------------------------------

    parametrize ([
      // single level
      // ... direct significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //  1             2              3              4             5
        // (IN) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            // level 4
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 5
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //  1             2              3             4
        // (IN) 0 -- 0 (GATE1) 0 -- 0 (GATE3) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            // level 3
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // single level
      // ... direct significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with multiple inputs
      [
        // -------------------------
        //  1             2              3              4
        // (IN1) 0 -- 0
        //            +-- (GATE1) 0 -- 0 (GATE2) 0 -- 0 (OUT)
        // (IN2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 1]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //  1                2             3
        // (IN1) 0 -- 0
        //            +-- (GATE1) 0 -- 0 (OUT)
        // (IN2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 1]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 3
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // single level
      // ... direct significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //  1              2                3              4             5
        // (IN1) 0 -- 0  (EXT)  0 -- 0
        //                           +-- (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT)
        // (IN2) 0 -- 0 (GATE1) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'EXT': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 1]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            // level 4
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 5
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //  1             2              3             4
        // (IN2) 0 -- 0 (GATE1) 0 -- 0 (GATE3) 0 -- 0 (OUT)
        // -------------------------
        {
          start: ['IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            // level 3
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // single level
      // ... direct significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with multiple inputs

      // single level
      // ... no significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with single input
      // TODO: test

      // single level
      // ... no significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with multiple inputs
      // TODO: test

      // single level
      // ... no significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with single input
      // TODO: test

      // single level
      // ... no significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with multiple inputs
      // TODO: test

      // multi level
      // ... direct significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //   1             2              3              4              5             6
        // (IN1) 0 -- 0  (EXT1) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0 (GATE4) 0 -- 0  (EXT2) 0 -- 0 (GATE5) 0 -- 0  (EXT3) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE4', 0, 0]] },
            // level 2
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT2', 0, 0]] },
            // level 3
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE5', 0, 0]] },
            // level 4
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //   1             2              3              4              5             6
        // (IN1) 0 -- 0  (EXT1) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0 (GATE4) 0 -- 0  (EXT2) 0 -- 0 (GATE5) 0 -- 0  (EXT3) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE4', 0, 0]] },
            // level 2
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT2', 0, 0]] },
            // level 3
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE5', 0, 0]] },
            // level 4
            'GATE2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // multi level
      // ... direct significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with multiple inputs
      [
        // -------------------------
        //  1             2              3              4
        // (IN1) 0 -- 0
        //            +-- (GATE1) 0 -- 0 (GATE2) 0 -- 0 (OUT1)
        // (IN2) 0 -- 1
        //
        // (IN3) 0 -- 0   (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 1]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT2', 0, 0]] },
            // level 4
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //  1                2             3
        // (IN1) 0 -- 0
        //            +-- (GATE1) 0 -- 0 (OUT)
        // (IN2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 1]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'GATE2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT2', 0, 0]] },
            // level 4
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // multi level
      // ... direct significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //   1             2              3                4              5             6
        // (IN1) 0 -- 0  (EXT1) 0 -- 0  (EXT3) 0 -- 0
        //                                          +-- (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0  (EXT2) 0 -- 0 (GATE1) 0 -- 1
        //
        // (IN3) 0 -- 0 (GATE4) 0 -- 0  (EXT4) 0 -- 0   (GATE5) 0 -- 0  (EXT5) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT2', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE4', 0, 0]] },
            // level 2
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['EXT3', 0, 0]] },
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT4', 0, 0]] },
            // level 3
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 1]] },
            'EXT4': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE5', 0, 0]] },
            // level 4
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT5', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT5': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //   1             2              3                4              5             6
        // (IN2) 0 -- 0  (EXT2) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN3) 0 -- 0 (GATE4) 0 -- 0  (EXT4) 0 -- 0 (GATE5) 0 -- 0  (EXT5) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT2', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE4', 0, 0]] },
            // level 2
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT4', 0, 0]] },
            // level 3
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'EXT4': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE5', 0, 0]] },
            // level 4
            'GATE2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT5', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT5': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],

      // TODO: same test but with SPLITTER

      // multi level
      // ... distant significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //   1             2              3              4              5             6
        // (IN1) 0 -- 0 (GATE1) 0 -- 0  (EXT2) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0  (EXT1) 0 -- 0 (GATE4) 0 -- 0 (GATE5) 0 -- 0  (EXT3) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT2', 0, 0]] },
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE5', 0, 0]] },
            // level 4
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //   1             2              3              4              5             6
        // (IN1) 0 -- 0 (GATE1) 0 -- 0  (EXT2) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0  (EXT1) 0 -- 0 (GATE4) 0 -- 0 (GATE5) 0 -- 0  (EXT3) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT2', 0, 0]] },
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE5', 0, 0]] },
            // level 4
            'GATE2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // multi level
      // ... distant significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //   1             2              3                4              5             6
        // (IN1) 0 -- 0  (EXT1) 0 -- 0 (EXT2) 0 -- 0
        //                                          +-- (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0 (GATE1) 0 -- 0 (EXT3) 0 -- 1
        //
        // (IN3) 0 -- 0 (GATE4) 0 -- 0 (GATE5) 0 -- 0   (GATE6) 0 -- 0  (EXT5) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE4', 0, 0]] },
            // level 2
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['EXT2', 0, 0]] },
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE5', 0, 0]] },
            // level 3
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 1]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE6', 0, 0]] },
            // level 4
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            'GATE6': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT5', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT5': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6s
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //   1             2              3             4              5             6
        // (IN2) 0 -- 0 (GATE1) 0 -- 0 (EXT3) 0 -- 0 (GATE2) 0 -- 0 (GATE3) 0 -- 0 (OUT1)
        // (IN3) 0 -- 0 (GATE4) 0 -- 0 (GATE5) 0 -- 0 (GATE6) 0 -- 0  (EXT5) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE4', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE5', 0, 0]] },
            // level 3
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE5': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE6', 0, 0]] },
            // level 4
            'GATE2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 0]] },
            'GATE6': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT5', 0, 0]] },
            // level 5
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT5': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 6
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],

      // TODO: same test but with SPLITTER

      // multi level
      // ... no significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with single input
      [
        // -------------------------
        //   1             2              3             4
        // (IN1) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0 (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT2', 0, 0]] },
            // level 4
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        //   1             2              3             4
        // (IN1) 0 -- 0 (GATE1) 0 -- 0 (GATE2) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0 (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'GATE1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT2', 0, 0]] },
            // level 4
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      [
        // -------------------------
        //   1             2                3             4
        // (IN1) 0 -- 0  (EXT)  0 -- 0
        //                           +-- (GATE2) 0 -- 0 (OUT)
        // (IN2) 0 -- 0 (GATE1) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            // level 2
            'EXT': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 1]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE1
        'GATE1',
        // -------------------------
        //   1             2                3             4
        // (IN1) 0 -- 0  (EXT)  0 -- 0
        //                           +-- (GATE2) 0 -- 0 (OUT)
        // (IN2) 0 -- 0 (GATE1) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE2', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE2', 0, 1]] },
            // level 2
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      [
        // -------------------------
        //   1             2              3             4
        // (IN1) 0 -- 0  (EXT)  0 -- 0 (GATE2) 0 -- 0 (OUT1)
        // (IN2) 0 -- 0 (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'EXT': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT2', 0, 0]] },
            // level 4
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
        // -------------------------
        //   1             2              3             4
        // (IN2) 0 -- 0 (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT2)
        // -------------------------
        {
          start: ['IN2'],
          end: ['OUT2'],
          nodes: {
            // level 1
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 3
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT2', 0, 0]] },
            // level 4
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],
      // multi level
      // ... no significant ancestor
      // ... ... on single ancestor line
      // ... ... ... with multiple inputs
      [
        // -------------------------
        //   1               2                3             4
        // (IN1) 0 -- 0   (GATE1) 0 -- 0
        //                             +-- (GATE2) 0 -- 0 (OUT)
        // (IN2) 0 -- 0                |
        //            +-- (GATE3) 0 -- 1
        // (IN3) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 1]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 1]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE3
        'GATE3',
        // -------------------------
        //   1            2                3             4
        // (IN1) 0 -- 0 (GATE1) 0 -- 0
        //                           +-- (GATE2) 0 -- 0 (OUT)
        // (IN2) 0 -- 0 (GATE3) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE3', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'GATE3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 1]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 4
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
      ],

      // multi level
      // ... no significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with single input
      // TODO: test

      // multi level
      // ... no significant ancestor
      // ... ... on multiple ancestor line
      // ... ... ... with multiple inputs
      // TODO: test

    ], (circuitBoard, targetId, expected) => {
      it.only ('should remove all but 1 ancestor path and convert the node to an extension type, when we remove a node, given 0 or 1 of its ancestors are SPLITTER or CHIP types or there are multiple nodes on its level', () => {
        // given
        // ... 0 or 1 of its ancestors are SPLITTER or CHIP type
        // ... or there are multiple nodes on its level
        const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
        const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)

        // when ... when we remove a node
        const result = SUT.removeNodeFromCircuitBoard (targetId) (levels) (circuitBoard)
        // mapObjIndexed ((x, n) => console.log(n, x)) (result.nodes)

        // then
        // ... should remove all but 1 of the nodes parents
        // ... and convert the target node to an extension type
        // ... retaining all ancestors of significant parent
        // ... removing empty levels and paths
        assert.deepEqual (result.start, expected.start)
        assert.deepEqual (result.end, expected.end)
        assert.deepEqual (map (pick (['chipId', 'type', 'graphAL'])) (result.nodes), expected.nodes)
      })
    })

    // =======================================
    // SCENARIO 3 (do nothing)
    // =======================================
    //
    // parametrized scenarios
    // ------------------------------------
    //
    // single level
    // ... direct significant ancestors
    // ... ... on single ancestor line (not possible)
    // ... ... on multiple ancestor line
    // ... distant significant ancestors
    // ... ... on single ancestor line (not possible)
    // ... ... on multiple ancestor line
    //
    // multi level
    // ... direct significant ancestors
    // ... ... on single ancestor line (not possible)
    // ... ... on multiple ancestor line
    // ... distant significant ancestors
    // ... ... on single ancestor line (not possible)
    // ... ... on multiple ancestor line
    // ------------------------------------

    parametrize ([
      // single level
      // ... direct significant ancestors
      // ... ... on multiple ancestor line
      [
        // -------------------------
        // (IN1) 0 -- 0 (GATE1) 0 -- 0
        //                         +-- (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT)
        // (IN2) 0 -- 0 (GATE2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE2', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 0]] },
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 1]] },
            // level 3
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 4
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 5
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE3
        'GATE3',
      ],
      // single level
      // ... distant significant ancestors
      // ... ... on multiple ancestor line
      [
        // -------------------------
        // (IN1) 0 -- 0 (GATE1) 0 -- 0 (EXT2)  0 -- 0
        //                                         +-- (GATE3) 0 -- 0 (GATE4) 0 -- 0 (OUT)
        // (IN2) 0 -- 0 (EXT1)  0 -- 1 (GATE2) 0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2'],
          end: ['OUT'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE2', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT2', 0, 0]] },
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            // level 3
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 0]] },
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE3', 0, 1]] },
            // level 4
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            // level 5
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT', 0, 0]] },
            // level 6
            'OUT': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE3
        'GATE3',
      ],
      // multi level
      // ... direct significant ancestor
      // ... ... on multiple ancestor line
      [
        // -------------------------
        // (IN1) 0 -- 0 (GATE1)   0 -- 0
        //                             +-- (GATE2) 0 -- 0 (GATE4) 0 -- 0 (OUT1)
        //                        0 -- 1
        // (IN2) 0 -- 0 (SPLT1) --+
        //                        1 -- 0
        //                             +-- (GATE3) 0 -- 0 (EXT2)  0 -- 0 (OUT2)
        // (IN3) 0 -- 0  (EXT1)   0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['SPLT1', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE2', 0, 0]] },
            'SPLT1': { chipId: null, type: NODE_TYPE.SPLITTER, graphAL: [['GATE2', 0, 1], ['GATE3', 1, 0]] },
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 1]] },
            // level 3
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT2', 0, 0]] },
            // level 4
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 5
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
      ],
      // multi level
      // ... distant significant ancestors
      // ... ... on multiple ancestor line
      [
        // -------------------------
        // (IN1) 0 -- 0 (GATE1) 0 -- 0  (EXT3)   0 -- 0
        //                                            +-- (GATE2) 0 -- 0 (GATE4) 0 -- 0 (OUT1)
        //                                       0 -- 1
        // (IN2) 0 -- 0  (EXT1) 0 -- 0 (SPLT1) --+
        //                                       1 -- 0
        //                                            +-- (GATE3) 0 -- 0 (EXT5)  0 -- 0 (OUT2)
        // (IN3) 0 -- 0  (EXT2) 0 -- 0  (EXT4)   0 -- 1
        // -------------------------
        {
          start: ['IN1', 'IN2', 'IN3'],
          end: ['OUT1', 'OUT2'],
          nodes: {
            // level 1
            'IN1': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['GATE1', 0, 0]] },
            'IN2': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT1', 0, 0]] },
            'IN3': { chipId: null, type: NODE_TYPE.INPUT, graphAL: [['EXT2', 0, 0]] },
            // level 2
            'GATE1': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT3', 0, 0]] },
            'EXT1': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['SPLT1', 0, 0]] },
            'EXT2': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['EXT4', 0, 1]] },
            // level 3
            'EXT3': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE2', 0, 0]] },
            'SPLT1': { chipId: null, type: NODE_TYPE.SPLITTER, graphAL: [['GATE2', 0, 1], ['GATE3', 1, 0]] },
            'EXT4': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['GATE3', 0, 1]] },
            // level 4
            'GATE2': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['GATE4', 0, 0]] },
            'GATE3': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['EXT5', 0, 0]] },
            // level 4
            'GATE4': { chipId: '1', type: NODE_TYPE.CHIP, graphAL: [['OUT1', 0, 0]] },
            'EXT5': { chipId: null, type: NODE_TYPE.EXTENSION, graphAL: [['OUT2', 0, 0]] },
            // level 5
            'OUT1': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
            'OUT2': { chipId: null, type: NODE_TYPE.OUTPUT, graphAL: [] },
          },
        },
        // remove GATE2
        'GATE2',
      ],
    ], (circuitBoard, targetId) => {
      it ('should do nothing, when we attempt to remove a node, given more than 1 of its ancestors are SPLITTER or CHIP types', () => {
        // given ... more than 1 of its ancestors are SPLITTER or CHIP types
        const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
        const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)

        // when ... when we attempt to remove a node
        const result = SUT.removeNodeFromCircuitBoard (targetId) (levels) (circuitBoard)
        // mapObjIndexed ((x, n) => console.log(n, x)) (result.nodes)

        // then ... should do nothing
        const expected = circuitBoard
        assert.deepEqual (result.start, expected.start)
        assert.deepEqual (result.end, expected.end)
        assert.deepEqual (map (pick (['chipId', 'type', 'graphAL'])) (result.nodes), expected.nodes)
      })
    })
  })
})
