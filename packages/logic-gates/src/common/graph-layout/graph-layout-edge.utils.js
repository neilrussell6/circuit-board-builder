const { find, propEq, prop, toPairs, pipe, reduce, add, chain, map, compose, pick, evolve, pluck, max, join } = require ('ramda')
const { v4: uuid } = require ('uuid')

//---------------------------------
// build edges
//---------------------------------

const calculateSpacing = i => total => spacing => (i * spacing) - (((total - 1) * spacing) / total)

const countSourceOutputs = compose (add (1), reduce (max) (0), pluck (1))

const countTargetInputs = compose (add (1), reduce (max) (0), pluck (2))

const buildAdjustedEdgeCoords = id => yAdjustment => pipe (
  find (propEq ('id') (id)),
  pick (['x', 'y']),
  evolve ({ y: add (yAdjustment) }),
)

// TODO: all vertex indices should be ids

const calculateEdgeSourceCoords = targets => vertices => sourceVertexId => sourceOutputIndex => edgeSpacing => {
  const sourceOutputCount = countSourceOutputs (targets)
  const yAdjustment = calculateSpacing (sourceOutputIndex) (sourceOutputCount) (edgeSpacing)
  return buildAdjustedEdgeCoords (sourceVertexId) (yAdjustment) (vertices)
}

const calculateEdgeTargetCoords = transposedGraphAL => vertices => targetVertexId => targetInputIndex => edgeSpacing => {
  const targetTransposedAdj = prop (targetVertexId) (transposedGraphAL)
  const targetInputCount = countTargetInputs (targetTransposedAdj)
  const yAdjustment = calculateSpacing (targetInputIndex) (targetInputCount) (edgeSpacing)
  return buildAdjustedEdgeCoords (targetVertexId) (yAdjustment) (vertices)
}

const buildEdges = edgeSpacing => graphVertexCoords => graphAL => transposedGraphAL => {
  const f = ([sourceVertexId, targets]) => {
    return map (([targetVertexId, sourceOutputIndex, targetInputIndex]) => ({
      id: join ('') ([sourceVertexId, sourceOutputIndex, targetVertexId, targetInputIndex]),
      sourceVertexId,
      sourceOutputIndex,
      source: calculateEdgeSourceCoords (targets) (graphVertexCoords) (sourceVertexId) (sourceOutputIndex) (edgeSpacing),
      target: calculateEdgeTargetCoords (transposedGraphAL) (graphVertexCoords) (targetVertexId) (targetInputIndex) (edgeSpacing),
    })) (targets)
  }
  return compose (chain (f), toPairs) (graphAL)
}

module.exports.buildEdges = buildEdges
