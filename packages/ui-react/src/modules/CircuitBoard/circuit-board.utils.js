import {
  pluck,
  isNil,
  compose,
  path,
  reduce,
  map,
  without,
  prop,
  evolve,
  omit,
  reject,
  flip,
  includes,
  concat,
  nth,
  append,
  filter,
  equals,
  lensPath,
  over,
  values,
  toPairs,
  invert,
  tail,
  init,
  pick,
  flatten,
  uniq,
  intersection,
  mergeLeft,
  mergeRight,
  head,
  identity,
  last,
  mapObjIndexed,
  none,
  converge,
  chain,
  reverse,
  pathOr,
  propEq,
  difference,
  isEmpty,
  pipe,
  addIndex,
} from 'ramda'
import {
  calculateGraphLevels,
  transposeGraphAdjacencyList,
  bfsAll,
  bfsShortestPathAny,
  lib,
} from '@nr6/nand2tetris-logic-gates'

import { EMPTY_CIRCUIT_BOARD, NODE_TYPE } from './constants'

const noop = () => null

//---------------------------------
// find node output value
//---------------------------------

export const findNodeOutputValueForIndex = graphData => id => i =>
  pathOr (null) ([id, 'outputs', i]) (graphData)

//---------------------------------
// attach data to edges
//---------------------------------

export const attachDataToGraphUIEdges = graphData => graphUIEdges =>
  map (({ id, sourceVertexId, sourceOutputIndex, source, target }) => {
    const value = findNodeOutputValueForIndex (graphData) (sourceVertexId) (sourceOutputIndex)
    return mergeRight ({ id, sourceVertexId, sourceOutputIndex, source, target }) ({ value })
  }) (graphUIEdges)

//---------------------------------
// attach data to vertices
//---------------------------------

export const attachDataToGraphUIVertices = graphData => circuitBoard => graphUIVertices =>
  map (({ id, x, y }) => {
    const value = findNodeOutputValueForIndex (graphData) (id) (0)
    const { label, type } = path (['nodes', id]) (circuitBoard)
    return reduce (mergeRight) ({}) ([{ id, x, y }, { value }, { label, type }])
  }) (graphUIVertices)

//---------------------------------
// circuit board update utils
//---------------------------------

const updateCircuitBoardNode = id => data => {
  const nodeLens = lensPath (['nodes', id])
  return over (nodeLens) (mergeLeft (data))
}

const updateCircuitBoardNodeGraphAL = id => ALId => data => evolve ({
  nodes: evolve ({
    [id]: evolve ({
      graphAL: map (x => head (x) === ALId ? data : x),
    }),
  }),
})

const appendCircuitBoardNodeGraphAL = id => data => evolve ({
  nodes: evolve ({
    [id]: evolve ({
      graphAL: append (data),
    }),
  }),
})

const removeNodesFromCircuitBoard = removeIds => evolve ({
  nodes: compose (
    map (evolve ({
      graphAL: reject (compose (flip (includes) (removeIds), nth (0))),
    })),
    omit (removeIds)),
  start: reject (flip (includes) (removeIds)),
  end: reject (flip (includes) (removeIds)),
})

//---------------------------------
// remove empty levels
//---------------------------------

const findEmptyLevels = types => circuitBoard => compose (
  reduce ((acc, [level, data]) =>
    none (id => includes (path (['nodes', id, 'type']) (circuitBoard)) (types)) (data) ? append (level) (acc) : acc
  ) ([]),
  tail,
  init,
  toPairs,
)

const reconnectNodesAffectedByRemoval = removeIds => circuitBoard => evolve ({
  nodes: mapObjIndexed ((node, id) => {
    const childrenPendingRemovalIds = chain (x => filter (equals (head (x))) (removeIds)) (prop ('graphAL') (node))
    const childrenPendingRemovalFirstChildIds = map (x => path (['nodes', x, 'graphAL', 0, 0]) (circuitBoard)) (childrenPendingRemovalIds)
    const newALNodes = map (id => [id, 0, 0]) (childrenPendingRemovalFirstChildIds)
    const newALNodeIds = compose (
      map (newALNodeId => {
        const currentFirstChildNodeId = compose (head, head, prop ('graphAL')) (node)
        const currentFirstChildNodeChildIds = compose (path (['nodes', currentFirstChildNodeId, 'graphAL'])) (circuitBoard)
        const currentFirstChildNodeChildIdMatchingNewALNode = compose (head, filter (propEq (0) (newALNodeId))) (currentFirstChildNodeChildIds)
        return isNil (currentFirstChildNodeChildIdMatchingNewALNode) ? [newALNodeId, 0, 0] : [newALNodeId, ...tail (currentFirstChildNodeChildIdMatchingNewALNode)]
      }),
      pluck (0),
    ) (newALNodes)
    return evolve ({ graphAL: concat (newALNodeIds) }) (node)
  }),
}) (circuitBoard)

const removeEmptyLevels = circuitBoard => {
  const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)

  // find ids on empty levels
  const levels = calculateGraphLevels (prop ('start') (circuitBoard)) (graphAL)
  const levelMap = (invert) (levels)
  const significantTypes = [NODE_TYPE.CHIP, NODE_TYPE.SPLITTER]
  // TODO: we need to remove SPLITTERS on empty rows, but we need to ensure their parents then split, so use the below and update reconnectNodesAffectedByRemoval
  // const significantTypes = [NODE_TYPE.CHIP]
  const emptyLevels = findEmptyLevels (significantTypes) (circuitBoard) (levelMap)
  const emptyLevelRemoveIds = compose (uniq, flatten, values, pick (emptyLevels)) (levelMap)

  // reconnect and remove
  return compose (
    removeNodesFromCircuitBoard (emptyLevelRemoveIds),
    reconnectNodesAffectedByRemoval (emptyLevelRemoveIds),
  ) (circuitBoard)
}

const removeEmptyPaths = circuitBoard => {
  const graphAL = compose (map (compose (prop ('graphAL'))), prop ('nodes')) (circuitBoard)
  const transposedGraphAL = transposeGraphAdjacencyList (graphAL)
  const boardInputIds = prop ('start') (circuitBoard)
  const boardOutputIds = prop ('end') (circuitBoard)
  const significantTypes = [NODE_TYPE.CHIP, NODE_TYPE.SPLITTER]

  // find ids on empty paths
  const paths = map (id => bfsAll (boardInputIds) (noop) (map (nth (0))) (id) (transposedGraphAL)) (boardOutputIds)
  const emptyVsNonEmptyPaths = pipe (
    reduce ((acc, ids) => {
      const significantIds = filter (id => includes (path (['nodes', id, 'type']) (circuitBoard)) (significantTypes)) (ids)
      return isEmpty (significantIds) ? evolve ({ emptyIds: concat (ids) }) (acc) : evolve ({ notEmptyIds: concat (ids) }) (acc)
    }) ({ emptyIds: [], notEmptyIds: [] }),
    evolve ({ emptyIds: uniq, notEmptyIds: uniq }),
    x => evolve ({ emptyIds: ids => difference (ids) (prop ('notEmptyIds') (x)) }) (x),
  ) (paths)

  // remove
  const { emptyIds } = emptyVsNonEmptyPaths
  return compose (
    removeNodesFromCircuitBoard (emptyIds),
  ) (circuitBoard)
}

//---------------------------------
// remove node from circuit board
//---------------------------------

const nodeCountAtLevel = id => compose (prop ('length'), converge (prop, [prop (id), invert]))
const getAncestors = sourceId => targetIds => compose (without ([sourceId]), bfsAll (targetIds) (noop) (identity) (sourceId))
const getDescendants = sourceId => targetIds => compose (without ([sourceId]), bfsAll (targetIds) (noop) (identity) (sourceId))
const filterByTypes = types => circuitBoard => reduce ((acc, id) =>
  includes (path (['nodes', id, 'type']) (circuitBoard)) (types) ? append (id) (acc) : acc
) ([])

export const removeNodeFromCircuitBoard = targetId => levels => circuitBoard => {
  // constraints
  //  1. the structure of the board must be maintained for remaining CHIP nodes
  //  2. "deleting" a node must not affect the functioning of another CHIP node

  // compute required data
  const graphAL = compose (map (compose (map (head), prop ('graphAL'))), prop ('nodes')) (circuitBoard)
  const transposedGraphAL = transposeGraphAdjacencyList (graphAL)
  const boardInputIds = prop ('start') (circuitBoard)
  const boardOutputIds = prop ('end') (circuitBoard)
  const ancestors = getAncestors (targetId) (boardInputIds) (transposedGraphAL)
  const descendants = getDescendants (targetId) (boardOutputIds) (graphAL)
  const levelCount = nodeCountAtLevel (targetId) (levels)
  const significantTypes = [NODE_TYPE.CHIP, NODE_TYPE.SPLITTER]
  const significantAncestors = filterByTypes (significantTypes) (circuitBoard) (ancestors)
  const significantDescendants = filterByTypes (significantTypes) (circuitBoard) (descendants)

  let result = circuitBoard

  // scenario 3
  // ...  we cannot do either scenario 1 or 2, without breaking one of the constraints
  if (significantAncestors.length > 1) {
    console.log('DEBUG: scenario 3')
    return result
  }

  // scenario 1
  // ... we can remove entire board
  // ... or we can remove node and all but 1 of it's board inputs
  if (significantAncestors.length === 0 && levelCount === 1) {
    console.log('DEBUG: scenario 1')
    if (significantDescendants.length === 0) {
      return EMPTY_CIRCUIT_BOARD
    }

    // ... get first board input connected to target for keeping
    // ... then delete target and all parents except board input path marked for keeping
    // ... then reconnect the kept board input path it to target's child
    const targetFirstBoardInputId = compose (nth (0), intersection (ancestors)) (boardInputIds)
    const targetFirstChildId = path (['nodes', targetId, 'graphAL', 0, 0]) (circuitBoard)
    const removeIds = append (targetId) (without ([targetFirstBoardInputId]) (ancestors))
    return compose (
      appendCircuitBoardNodeGraphAL (targetFirstBoardInputId) ([targetFirstChildId, 0, 0]),
      removeNodesFromCircuitBoard (removeIds),
    ) (circuitBoard)
  }

  // scenario 2
  // ... we can remove all but 1 of the node's parents and convert it to an EXTENSION or SPLITTER type
  console.log('DEBUG: scenario 2')
  // ... determine which of target node's parent hierarchies should be kept
  // ... delete all but that parent hierarchy
  // ... convert target node to an extension or splitter
  // ... convert the remaining parent's target index to 0
  if (significantAncestors.length === 1) {
    const firstSignificantAncestorId = head (significantAncestors)
    const firstSignificantAncestorAncestors = compose (getAncestors (firstSignificantAncestorId) (boardInputIds)) (transposedGraphAL)
    const firstSignificantAncestorPath = compose (
      concat (firstSignificantAncestorAncestors),
      without ([targetId]),
      reverse,
      bfsShortestPathAny (identity) (targetId) ([firstSignificantAncestorId]),
    ) (transposedGraphAL)
    const removeIds = without (firstSignificantAncestorPath) (ancestors)
    const newParentId = last (firstSignificantAncestorPath)
    return compose (
      removeEmptyPaths,
      removeEmptyLevels,
      updateCircuitBoardNode (targetId) ({ chipId: null, type: NODE_TYPE.EXTENSION, f: lib.ID }),
      updateCircuitBoardNodeGraphAL (newParentId) (targetId) ([targetId, 0, 0]),
      removeNodesFromCircuitBoard (removeIds),
    ) (circuitBoard)
  }
  if (levelCount > 1) {
    const ancestors = getAncestors (targetId) (boardInputIds) (transposedGraphAL)
    const removeIds = compose (difference (ancestors), without ([targetId]), bfsShortestPathAny (identity) (targetId) (boardInputIds)) (transposedGraphAL)
    return compose (
      removeEmptyPaths,
      removeEmptyLevels,
      updateCircuitBoardNode (targetId) ({ chipId: null, type: NODE_TYPE.EXTENSION, f: lib.ID }),
      removeNodesFromCircuitBoard (removeIds),
    ) (circuitBoard)
  }

  return result
}
