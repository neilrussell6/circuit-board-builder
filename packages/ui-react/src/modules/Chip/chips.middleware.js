import { setClickedChipId } from './clickedChipId.reducer'
import { MODE } from '../Mode/mode.constants'
import { setCircuitBoard, setSelectedNodeId } from '../CircuitBoard'

export const setClickedChipIdFlow = ({ dispatch, getState }) => next => async action => {
  const result = next (action)

  if (setClickedChipId.match (action)) {
    const { mode, clickedChipId, chips } = getState ()

    if (mode === MODE.SELECT && clickedChipId > 0) {
      const chip = chips[clickedChipId]
      const { circuitBoard } = chip
      dispatch (setSelectedNodeId (0))
      dispatch (setCircuitBoard (circuitBoard))
    }
  }

  return result
}
