import { createSelector } from '@reduxjs/toolkit'

import { selectedNodeSelector, selectedNodeChipSelector } from '../circuitBoard.selectors'

export const NodeDetailSelector = createSelector(
  [selectedNodeSelector, selectedNodeChipSelector],
  (node, chip) => ({
    node,
    chip,
    nodeInputs: { '0': 1, '1': 0 }, // TODO: we need to get this object from circuit board in state
  }),
)
