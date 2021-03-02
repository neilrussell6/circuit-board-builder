import { lib } from '@nr6/nand2tetris-logic-gates'

export const DEFAULT_CHIPS = {
  1: {
    name: 'ID',
    description: 'ID',
    functionality: lib.ID,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 1,
  },
  2: {
    name: 'NAND',
    description: 'NAND',
    functionality: lib.NAND,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 2,
  },
  3: {
    name: 'NOT',
    description: 'NOT',
    functionality: lib.NOT,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 3,
  }
}
