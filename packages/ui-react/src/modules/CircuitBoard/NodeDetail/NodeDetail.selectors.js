import { createSelector } from '@reduxjs/toolkit'

import { selectedNodeSelector } from '../circuitBoard.selectors'

export const NodeDetailSelector = createSelector(
  [selectedNodeSelector],
  node => ({
    node,
  }),
)
