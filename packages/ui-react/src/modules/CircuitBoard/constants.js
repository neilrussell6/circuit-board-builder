import { CHIP_CIRCUIT_BOARDS } from '../Chip/constants'

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

export const DEFAULT_CIRCUIT_BOARD = CHIP_CIRCUIT_BOARDS.DEMO_1
