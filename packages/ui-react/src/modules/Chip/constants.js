import { lib } from '@nr6/nand2tetris-logic-gates'

export const DEFAULT_BLANK_CHIP = {
  id: 0,
  name: '',
  description: '',
  truthTable: [],
  inputs: [],
  outputs: [],
}

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
  },
  4: {
    name: 'AND',
    description: 'Outputs true if both inputs are true.',
    functionality: lib.AND,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 4,
  },
  5: {
    name: 'OR',
    description: 'Outputs true if either input is true.',
    functionality: lib.OR,
    truthTable: [],
    inputs: [],
    outputs: [],
    id: 5,
  }
}
