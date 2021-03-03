import { pathOr } from 'ramda'

export const findNodeChipId = nodeId => pathOr (null) ([nodeId, 'chipId'])
