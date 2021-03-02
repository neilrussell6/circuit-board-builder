import { lib } from '@nr6/nand2tetris-logic-gates'

export const DEFAULT_CHIPS = {
  1: {
    name: 'ID',
    description: 'Outputs the same value as the input.',
    functionality: lib.ID,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 1,
  },
  2: {
    name: 'NAND',
    description: 'Outputs true unless both inputs are true',
    functionality: lib.NAND,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 2,
  },
  3: {
    name: 'NOT',
    description: 'Outputs true if the input it false and false if the input is true.',
    functionality: lib.NOT,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 3,
  }
}
