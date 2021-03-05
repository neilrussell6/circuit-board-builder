import { always, compose, ifElse, nth, path, propEq, reduce, mergeRight, map, pathOr, tap } from 'ramda'

//---------------------------------
// find node output value
//---------------------------------

export const findNodeOutputValueForIndex = graphData => id => i =>
  pathOr (null) ([id, 'outputs', i]) (graphData)

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
// attach data to edges
//---------------------------------

export const attachDataToGraphUIEdges = graphData => graphUIEdges =>
  map (({ sourceVertexId, sourceOutputIndex, source, target }) => {
    const value = findNodeOutputValueForIndex (graphData) (sourceVertexId) (sourceOutputIndex)
    return mergeRight ({ sourceVertexId, sourceOutputIndex, source, target }) ({ value })
  }) (graphUIEdges)

