import { propOr, pipe, unless, equals } from 'ramda'

export const findSelectedNodeChipId = (nodeId, nodes) => pipe (
  propOr(0, nodeId),
  unless (
    equals() (0),
    propOr (0, 'chipId'),
  ),
) (nodes)
