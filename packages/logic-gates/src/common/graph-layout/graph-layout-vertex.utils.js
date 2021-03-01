const { compose, map, keys, prop, indexOf } = require ('ramda')

//---------------------------------
// build vertices
//---------------------------------

const buildVertices = hspacing => vspacing => graphAL => dataMap => levelVertexMap => levelVertices => {
  const f = id => {
    // x & y
    const level = prop (id) (levelVertexMap)

    // ... x
    const x = level * hspacing

    // ... y
    const _levelVertices = prop (level) (levelVertices)
    const levelIndex = indexOf (id) (prop (level) (levelVertices))
    const yOffset = -((vspacing / 2) * (_levelVertices.length - 1)) // vertically align
    const y = yOffset === 0 ? 0 : (levelIndex * vspacing) + yOffset

    return { id, x, y, ...prop (id) (dataMap) }
  }

  return compose (map (f), keys) (graphAL)
}

module.exports.buildVertices = buildVertices
