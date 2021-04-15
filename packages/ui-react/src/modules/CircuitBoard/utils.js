import {
  pathOr,
  values,
  startsWith,
  compose,
  keys,
  prop,
  reduce,
  assoc,
  evolve,
  map,
  fromPairs,
  toPairs,
  mapObjIndexed,
} from 'ramda'
import { v4 as uuid } from 'uuid'

export const findNodeChipId = nodeId => pathOr (null) ([nodeId, 'chipId'])

export const isTruthTableRowIsActive = nodeInputs => truthTableRow => {
  const nodeInputValues = values (nodeInputs)
  return startsWith (nodeInputValues) (truthTableRow)
}

export const assocUniqueIds = circuitBoard => {
  const ids = compose (keys, prop ('nodes')) (circuitBoard)
  const uniqueIds = reduce ((acc, id) => assoc (id) (uuid()) (acc)) ({}) (ids)
  return evolve ({
    start: map (id => prop (id) (uniqueIds)),
    end: map (id => prop (id) (uniqueIds)),
    nodes: compose (
      fromPairs,
      map (([k, v]) => [
        prop (k) (uniqueIds),
        evolve ({
          graphAL: map (([id, ...xs]) => [prop (id) (uniqueIds), ...xs])
        }) (v),
      ]),
      toPairs,
    ),
  }) (circuitBoard)
}
