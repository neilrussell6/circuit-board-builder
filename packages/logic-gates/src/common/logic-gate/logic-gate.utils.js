const { has, mergeRight, fromPairs, pluck, nth, zip, map, chain, compose, prop } = require ('ramda')

//---------------------------------
// recursive transposed graph traversal
// ... Recursively applies parent vertex
// ... outputs to each vertex function.
// ... Also passes each vertex index,
// ... inputs and outputs back to caller
//---------------------------------

const traverseWith = callback => fs => start => graph => {
  let memo = {} // TODO: is there a way to include in g?
  const g = n => {
    // ... get adjacent vertices (parents / inputs)
    // ... get vertex's function
    const adj = prop (n) (graph)
    const f = prop (n) (fs)

    // ... get or calculate inputs
    // ... and remember
    const inputs = map (([m]) => {
      if (has (m) (memo)) {
        return prop (m) (memo)
      }
      return g (m)
    }) (adj)
    memo = compose (mergeRight (memo), fromPairs, zip (pluck (0) (adj))) (inputs)

    // ... extract correct inputs (i) for function
    // ... call vertex's function
    // ... passing vertex index, inputs and outputs to caller
    // ... return outputs
    const adjInputIndices = pluck (1) (adj) // source indices of adjacent inputs
    const fInputs = compose (map (([i, x]) => nth (i) (x)), zip (adjInputIndices)) (inputs)

    const outputs = f (fInputs)
    callback (n, fInputs, outputs)
    return outputs
  }
  return chain (g) (start)
}

module.exports.traverseWith = traverseWith

//---------------------------------
// extract vertex indices
// ... from adjacent data
//---------------------------------

const extractVertexIndices = map (nth (0))

module.exports.extractVertexIndices = extractVertexIndices
