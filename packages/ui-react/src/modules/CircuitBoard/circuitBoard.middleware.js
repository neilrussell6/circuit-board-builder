import { selectNode } from './circuitBoard.reducer'
import { setSelectedNodeId } from './selectedNodeId.reducer'
import { setSelectedChipId } from '../Chip/selectedChipId.reducer'
import { findSelectedNodeChipId } from './utils'

export const selectNodeFlow = () => ({ dispatch, getState }) => next => async action => {
  const result = next (action)

  if (selectNode.match (action)) {
    const { payload: nodeId } = action
    const { circuitBoard } = getState ()
    const { nodes } = circuitBoard
    const chipId = findSelectedNodeChipId (nodeId, nodes)

    dispatch (setSelectedNodeId (nodeId))
    dispatch (setSelectedChipId (chipId))
  }

  return result
}
