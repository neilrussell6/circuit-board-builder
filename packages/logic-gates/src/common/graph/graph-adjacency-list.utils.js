const {
  is,
  nth,
  last,
  reverse,
  propOr,
  min,
  head,
  reject,
  pipe,
  mapObjIndexed,
  concat,
  isNil,
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
  indexOf,
  sort,
  lt,
  flip,
  tail,
  equals,
} = require ('ramda')

//---------------------------------
// transpose graph adjacency list
//---------------------------------

// TODO: his now supports { a: [b, c] } as well as { a: [[b, 0, 0], [
const transposeGraphAdjacencyList = (graphAL) => {
  let result = map (() => []) (graphAL)
  forEach (([id, adjIds]) => {
    forEach (item => {
      const adjId = is (Array) (item) ? head (item) : item
      if (!has (adjId) (result)) {
        result[adjId] = []
      }
      result[adjId].push (is (Array) (item) ? [id, ...tail (item)] : id)
    }) (adjIds)
  }) (toPairs (graphAL))
  return result
}

module.exports.transposeGraphAdjacencyList = transposeGraphAdjacencyList

//---------------------------------
// calculate graph levels
// ... using BFS
//---------------------------------

// TODO: remove and use bfsLevels instead
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
      propOr ([]) (n), // TODO: why do we need this fallback?
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
// sort graph levels to vertex indices map
//---------------------------------

// TODO: make this more efficient
const sortGraphLevelToVertexIdMap = graphAL => levelVertexIdMap => {
  const getLowestChildIndex = xs => id => {
    // first level
    if (isNil (xs)) {
      return 0
    }
    // other levels
    const childrenIds = compose (pluck (0), prop (id)) (graphAL)
    // ... get lowest child index
    return compose (propOr (-1) (0), sort (min), reject (flip (lt) (0)), map (id => indexOf (id) (xs))) (childrenIds)
  }
  const getLowestChildInputIndex = id => {
    const childrenIndices = prop (id) (graphAL)
    return compose (nth (0), sort (min), pluck (2)) (childrenIndices)
  }
  return pipe (
    reverse,
    reduce ((acc, levelVertexIds) => {
      const f = getLowestChildIndex (last (acc))
      const g = getLowestChildInputIndex
      const x = sort ((a, b) => {
        // compare lowest child vertex indices and lowest child vertex input indices
        return f (a) - f (b) || g (a) - g (b)
      }) (levelVertexIds)
      return concat (acc) ([x])
    }) ([]),
    reverse,
  ) (levelVertexIdMap)
}

module.exports.sortGraphLevelToVertexIdMap = sortGraphLevelToVertexIdMap

//---------------------------------
// recursive graph search
// ... using provided algorithm
// ... searching for all target ids
//---------------------------------

const sAll = f => ids => {
  const _ids = is (Array) (ids) ? ids : [ids]
  let found = []
  const predicate = id => {
    if (includes (id) (_ids)) {
      found.push (id)
    }
    if (found.length === _ids.length) {
      return true
    }
    return false
  }
  return f (predicate)
}

//---------------------------------
// recursive graph search
// ... using provided algorithm
// ... searching for any target ids
//---------------------------------

const sAny = f => ids => {
  const _ids = is (Array) (ids) ? ids : [ids]
  const predicate = id => includes (id) (_ids)
  return f (predicate)
}

//---------------------------------
// graph traversal
// ... using bfs algorithm
// ... with levels
//---------------------------------

// TODO: implement more functional recursive version, then merge with s
const bfsLevels = predicate => callback => transformer => start => graph => {
  const _start = is (Array) (start) ? start : [start]
  const queue = [..._start] // not visited
  const visited = [..._start]

  complete:
  while (queue.length > 0) {
    const n = queue.shift ()
    const adj = compose (transformer, propOr ([]) (n)) (graph)
    for (const m of adj) {
      if (includes (m) (visited)) {
        continue
      }
      callback (m, n)
      if (predicate (m)) {
        break complete
      }
      queue.push (m)
      visited.push (m)
    }
  }

  return visited
}

//---------------------------------
// calculate graph levels
// ... using bfs algorithm
// ... from provided vertex
// ... completes once all target vertices are discovered
//---------------------------------

const bfsCalculateLevelsAll = ids => transformer => targetId => graphAL => {
  const _targetId = is (Array) (targetId) ? targetId : [targetId]
  const levels = mapObjIndexed ((_, i) => includes (i) (_targetId) ? 0 : null) (graphAL)
  const callback = (candidate, predecessor) => {
    levels[candidate] = levels[predecessor] + 1
  }
  sAll (bfsLevels) (ids) (callback) (transformer) (targetId) (graphAL)
  return levels
}

module.exports.bfsCalculateLevelsAll = bfsCalculateLevelsAll

//---------------------------------
// calculate graph shortest path
// ... using bfs algorithm
// ... from source to target vertex
//---------------------------------

const calculateShortestPath = predecessors => sourceId => targetId => {
  const f = id => {
    if (id === sourceId) {
      return [id]
    }
    return [id, ...f(predecessors[id])]
  }
  return compose (reverse, f) (targetId)
}

const bfsShortestPath = transformer => sourceId => targetId => graphAL => {
  const predecessors = {}
  const callback = (candidate, predecessor)  => {
    predecessors[candidate] = predecessor
  }
  let shortestPath = null
  const predicate = id => {
    if (equals (targetId) (id)) {
      shortestPath = calculateShortestPath (predecessors) (sourceId) (targetId)
      return true
    }
    return false
  }
  bfsLevels (predicate) (callback) (transformer) (sourceId) (graphAL)
  return shortestPath
}

module.exports.bfsShortestPath = bfsShortestPath

//---------------------------------
// calculate graph shortest path
// ... using bfs algorithm
// ... from source to any of target vertices
//---------------------------------

const bfsShortestPathAny = transformer => sourceId => targetIds => graphAL => {
  let result = null
  for (const targetId of targetIds) {
    result = bfsShortestPath (transformer) (sourceId) (targetId) (graphAL)
    if (!isNil (result)) {
      break
    }
  }
  return result
}

module.exports.bfsShortestPathAny = bfsShortestPathAny

//---------------------------------
// breadth first search
// ... with levels
// ... from provided vertex
//---------------------------------

module.exports.bfsLevels = bfsLevels

//---------------------------------
// breadth first search
// ... with levels
// ... from provided vertex
// ... completes once all target vertices are discovered
//---------------------------------

module.exports.bfsLevelsAll = sAll (bfsLevels)

//---------------------------------
// breadth first search
// ... with levels
// ... from provided vertex
// ... completes once any target vertex is discovered
//---------------------------------

module.exports.bfsLevelsAny = sAny (bfsLevels)

//---------------------------------
// recursive graph traversal
// ... using provided algorithm (bfs or dfs)
//---------------------------------

// TODO: add callback variant
const s = algorithm => predicate => callback => transformer => start => graph => {
  const _start = is (Array) (start) ? start : [start]
  // candidate vertices -> visited vertices
  const f = ([c, ...cs]) => vis => {
    if (isNil (c)) {
      return vis
    }
    if (includes (c) (vis)) {
      return f (cs) (vis)
    }
    callback (c)
    if (predicate (c)) {
      return concat (vis) ([c])
    }
    const adj = compose (transformer, prop (c)) (graph)
    // only difference between dfs and bfs is how we order the new candidate vertices
    return algorithm === 'dfs'
      ? f (concat (adj) (cs)) (concat (vis) ([c]))
      : f (concat (cs) (adj)) (concat (vis) ([c]))
  }
  return f (_start) ([])
}

//---------------------------------
// recursive depth first search
// ... from provided vertex
// ... returns all visited vertices
//---------------------------------

module.exports.dfs = s ('dfs')

//---------------------------------
// recursive depth first search
// ... from provided vertex
// ... returns all visited vertices
// ... once all target vertices are discovered
//---------------------------------

module.exports.dfsAll = sAll (s ('dfs'))

//---------------------------------
// recursive depth first search
// ... from provided vertex
// ... returns all visited vertices
// ... once any target vertex is discovered
//---------------------------------

module.exports.dfsAny = sAny (s ('dfs'))

//---------------------------------
// recursive breadth first search
// ... from provided vertex
// ... returns all visited vertices
//---------------------------------

module.exports.bfs = s ('bfs')

//---------------------------------
// recursive breadth first search
// ... from provided vertex
// ... returns all visited vertices
// ... once all target vertices are discovered
//---------------------------------

module.exports.bfsAll = sAll (s ('bfs'))

//---------------------------------
// recursive breadth first search
// ... from provided vertex
// ... returns all visited vertices
// ... once any target vertex is discovered
//---------------------------------

module.exports.bfsAny = sAny (s ('bfs'))
