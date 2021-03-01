const {
  pipe,
  mapObjIndexed,
  concat,
  isNil,
  ifElse,
  over,
  lensPath,
  append,
  insert,
  has,
  reduce,
  forEach,
  toPairs,
  when,
  map,
  includes,
  prop,
  compose,
  pluck,
} = require ('ramda')

//---------------------------------
// transpose graph adjacency list
//---------------------------------

const transposeGraphAdjacencyList = graphAL => {
  let result = map (() => []) (graphAL)
  forEach (([x, xs]) => {
    forEach (([y, ...ys]) => {
      if (!has (y) (result)) {
        result[y] = []
      }
      result[y].push ([x, ...ys])
    }) (xs)
  }) (toPairs (graphAL))
  return result
}

module.exports.transposeGraphAdjacencyList = transposeGraphAdjacencyList

//---------------------------------
// calculate graph levels
// using BFS
//---------------------------------

const calculateGraphLevels = start => graph => {
  const levels = mapObjIndexed ((_, i) => includes (i) (start) ? 0 : null) (graph)
  const queue = [...start] // not visited
  const visited = [...start]

  while (queue.length > 0) {
    const n = queue.shift ()

    const adj = compose (
      when (
        x => x.length > 0,
        pluck (0),
      ),
      prop (n),
    ) (graph)

    forEach (m => {
      if (includes (m) (visited)) {
        return
      }
      queue.push (m)
      levels[m] = levels[n] + 1
      visited.push (m)
    }) (adj)
  }

  return levels
}

module.exports.calculateGraphLevels = calculateGraphLevels

//---------------------------------
// map graph levels to vertex indices
//---------------------------------

const buildGraphLevelToVertexIndexMap = levels => pipe (
  toPairs,
  reduce ((acc, [k, level]) => ifElse (
    has (level),
    over (lensPath ([level])) (append (k)),
    insert (level) ([k]),
  ) (acc)) ([]),
) (levels)

module.exports.buildGraphLevelToVertexIndexMap = buildGraphLevelToVertexIndexMap

//---------------------------------
// breadth first search
//---------------------------------

// bfs :: (a -> b) -> [a] -> AdjacencyList a -> ([a] -> [a] -> [a])
const bfs = transformer => start => graph => id => {
  // f :: candidate vertices -> visited vertices
  const f = ([c, ...cs]) => vis => {
    if (isNil (c)) {
      return vis
    }
    if (includes (c) (vis)) {
      return f (cs) (vis)
    }
    if (c === id) {
      return concat (vis) ([c])
    }
    const adj = compose (transformer, prop (c)) (graph)
    return f (concat (cs) (adj)) (concat (vis) ([c]))
  }
  return f (start) ([])
}

module.exports.bfs = bfs

//---------------------------------
// find all of a vertex's parents
//---------------------------------

const findParents = transformer => transposedGraphAL => id =>
  bfs (transformer) ([id]) (transposedGraphAL) (null)

module.exports.findParents = findParents
