import { pathOr, values, startsWith } from 'ramda'

export const findNodeChipId = nodeId => pathOr (null) ([nodeId, 'chipId'])

export const isTruthTableRowIsActive = nodeInputs => truthTableRow => {
  const nodeInputValues = values (nodeInputs)
  return startsWith (nodeInputValues) (truthTableRow)
}
