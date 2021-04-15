import { lib } from '@nr6/nand2tetris-logic-gates'

// TODO: use the NODE_TYPES in CircuitBoard constants
const NODE_TYPE = {
  INPUT: 'input',
  CHIP: 'chip',
  OUTPUT: 'output',
}

export const DEFAULT_BLANK_CHIP = {
  id: 0,
  name: '',
  description: '',
  truthTable: [],
  inputs: [],
  outputs: [],
}

export const CHIP_IDS = {
  ID: 1,
  NAND: 2,
  NOT: 3,
  AND: 4,
  OR: 5,
  MUX: 6,
  DMUX: 7,
  DEMO_1: 8,
}

const CHIP_DATA = {
  ID: {
    start: ['0'],
    end: ['2'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['1', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: CHIP_IDS.ID, label: 'ID', type: NODE_TYPE.CHIP, graphAL: [['2', 0, 0]], f: lib.ID },
      '2': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
    },
  },
  NOT: {
    start: ['0'],
    end: ['2'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['1', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: CHIP_IDS.NOT, label: 'NOT', type: NODE_TYPE.CHIP, graphAL: [['2', 0, 0]], f: lib.NOT },
      '2': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
    },
  },
  AND: {
    start: ['0', '1'],
    end: ['3'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 1]], f: lib.VALUE (false) },
      '2': { chipId: CHIP_IDS.AND, label: 'AND', type: NODE_TYPE.CHIP, graphAL: [['3', 0, 0]], f: lib.AND },
      '3': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
    },
  },
  NAND: {
    start: ['0', '1'],
    end: ['3'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 1]], f: lib.VALUE (false) },
      '2': { chipId: CHIP_IDS.NAND, label: 'NAND', type: NODE_TYPE.CHIP, graphAL: [['3', 0, 0]], f: lib.NAND },
      '3': {  chipId: null,  label: '',  type: NODE_TYPE.OUTPUT,  graphAL: [], f: lib.ID },
    },
  },
  OR: {
    start: ['0', '1'],
    end: ['3'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 1]], f: lib.VALUE (false) },
      '2': { chipId: CHIP_IDS.OR, label: 'OR', type: NODE_TYPE.CHIP, graphAL: [['3', 0, 0]], f: lib.OR },
      '3': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
    },
  },
  MUX: {
    start: ['0', '1', '2'],
    end: ['4'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['3', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['3', 0, 1]], f: lib.VALUE (false) },
      '2': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['3', 0, 2]], f: lib.VALUE (false) },
      '3': { chipId: CHIP_IDS.MUX, label: 'MUX', type: NODE_TYPE.CHIP, graphAL: [['4', 0, 0]], f: lib.MUX },
      '4': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
    },
  },
  DMUX: {
    start: ['0', '1'],
    end: ['3', '4'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 1]], f: lib.VALUE (false) },
      '2': { chipId: CHIP_IDS.DMUX, label: 'DMUX', type: NODE_TYPE.CHIP, graphAL: [['3', 0, 0], ['4', 0, 0]], f: lib.DMUX },
      '3': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
      '4': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID,
      },
    },
  },
  DEMO_1: {
    start: ['0', '1', '3'],
    end: ['6', '7'],
    nodes: {
      '0': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 0]], f: lib.VALUE (true) },
      '1': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['2', 0, 1]], f: lib.VALUE (false) },
      '2': { chipId: CHIP_IDS.AND, label: 'AND', type: NODE_TYPE.CHIP, graphAL: [['5', 0, 0]], f: lib.AND },
      '3': { chipId: null, label: '', type: NODE_TYPE.INPUT, graphAL: [['4', 0, 0]], f: lib.VALUE (true) },
      '4': { chipId: CHIP_IDS.NOT, label: 'NOT', type: NODE_TYPE.CHIP, graphAL: [['5', 0, 1]], f: lib.NOT },
      '5': { chipId: CHIP_IDS.OR, label: 'OR', type: NODE_TYPE.CHIP, graphAL: [['6', 0, 0], ['7', 0, 0]], f: lib.OR },
      '6': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
      '7': { chipId: null, label: '', type: NODE_TYPE.OUTPUT, graphAL: [], f: lib.ID },
    },
  },
}

// export const CHIP_CIRCUIT_BOARDS = map (assocUniqueIds) (CHIP_DATA)
export const CHIP_CIRCUIT_BOARDS = CHIP_DATA

export const DEFAULT_CHIPS = {
  [CHIP_IDS.ID]: {
    name: 'ID',
    description: 'Outputs the same value as the input.',
    functionality: lib.ID,
    truthTable: [
      ['in', 'out'],
      [0, 0],
      [1, 1],
    ],
    inputs: ['in'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.ID,
    id: CHIP_IDS.ID,
  },
  [CHIP_IDS.NAND]: {
    name: 'NAND',
    description: 'Outputs true unless both inputs are true',
    functionality: lib.NAND,
    truthTable: [
      ['a', 'b', 'out'],
      [0, 0, 1],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
    inputs: ['a', 'b'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.NAND,
    id: CHIP_IDS.NAND,
  },
  [CHIP_IDS.NOT]: {
    name: 'NOT',
    description: 'Outputs true if the input it false and false if the input is true.',
    functionality: lib.NOT,
    truthTable: [
      ['in', 'out'],
      [0, 1],
      [1, 0],
    ],
    inputs: ['in'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.NOT,
    id: CHIP_IDS.NOT,
  },
  [CHIP_IDS.AND]: {
    name: 'AND',
    description: 'Outputs true if both inputs are true.',
    functionality: lib.AND,
    truthTable: [
      ['a', 'b', 'out'],
      [0, 0, 0],
      [0, 1, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    inputs: ['a', 'b'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.AND,
    id: CHIP_IDS.AND,
  },
  [CHIP_IDS.OR]: {
    name: 'OR',
    description: 'Outputs true if either input is true.',
    functionality: lib.OR,
    truthTable: [
      ['a', 'b', 'out'],
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    inputs: ['a', 'b'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.OR,
    id: CHIP_IDS.OR,
  },
  [CHIP_IDS.MUX]: {
    name: 'MUX',
    description: 'Outputs the value of a if sel is false, otherwise it outputs the value of b.',
    functionality: lib.MUX,
    truthTable: [
      ['a', 'b', 'sel', 'out'],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 0, 1, 0],
      [1, 1, 0, 1],
      [1, 1, 1, 1],
    ],
    inputs: ['a', 'b', 'sel'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.MUX,
    id: CHIP_IDS.MUX,
  },
  [CHIP_IDS.DMUX]: {
    name: 'DMUX',
    description: 'Output a equals the input value if sel is false, otherwise output b equals the input value.',
    functionality: lib.DMUX,
    truthTable: [
      ['in', 'sel', 'a', 'b'],
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 1, 0, 1],
    ],
    inputs: ['in', 'sel'],
    outputs: ['a', 'b'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.DMUX,
    id: CHIP_IDS.DMUX,
  },
  [CHIP_IDS.DEMO_1]: {
    name: 'DEMO 1',
    description: 'Demo circuit board',
    functionality: () => false,
    truthTable: [],
    inputs: ['a', 'b', 'c'],
    outputs: ['out'],
    circuitBoard: CHIP_CIRCUIT_BOARDS.DEMO_1,
    id: CHIP_IDS.DEMO_1,
  },
}
