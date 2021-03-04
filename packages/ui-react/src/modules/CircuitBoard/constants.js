import {lib} from "@nr6/nand2tetris-logic-gates";

export const SVG_WIDTH = 1280
export const SVG_HEIGHT = 220
export const NODE_TYPE = {
    INPUT: 'input',
    CHIP: 'chip',
    OUTPUT: 'output',
}

export const DEFAULT_BLANK_NODE = {
  chipId: null,
  label: '',
  type: NODE_TYPE.CHIP,
  graphAL: [],
  f: () => null,
}

export const DEFAULT_CIRCUIT_BOARD = {
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
      chipId: 4,
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
      chipId: 3,
      label: 'NOT',
      type: NODE_TYPE.CHIP,
      graphAL: [['5', 0, 1]],
      f: lib.NOT,
    },
    '5': {
      chipId: 5,
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
