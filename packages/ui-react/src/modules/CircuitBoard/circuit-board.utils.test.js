const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const SUT = require ('./circuit-board.utils.js')

describe ('modules/CircuitBoard/circuit-board.utils', () => {
  describe ('findNodeOutputValueForIndex', () => {
    parametrize ([
      [
        {
          'A': { outputs: [false] },
          'B': { outputs: [true] },
          'C': { outputs: [true, false] },
        },
      ],
    ], [
      ['A', 0, false],
      ['B', 0, true],
      ['C', 0, true],
      ['C', 1, false],
      ['C', 2, null],
    ], (graphData, id, i, expected) => {
      it ('should return first output for correct single output node', () => {
        const result = SUT.findNodeOutputValueForIndex (graphData) (id) (i)
        assert.equal (result, expected)
      })
    })
  })

  describe ('attachDataToGraphUIVertices', () => {
    parametrize ([
      [
        {
          'A': { outputs: [false] },
          'B': { outputs: [true] },
        },
        {
          nodes: {
            'A': { label: 'NODE A', type: 'NODE A TYPE' },
            'B': { label: 'NODE B', type: 'NODE B TYPE' },
          },
        },
        [
          { id: 'A', x: 111, y: 222 },
          { id: 'B', x: 333, y: 444 },
        ],
        [
          { id: 'A', x: 111, y: 222, value: false, label: 'NODE A', type: 'NODE A TYPE' },
          { id: 'B', x: 333, y: 444, value: true, label: 'NODE B', type: 'NODE B TYPE' },
        ],
      ],
    ], (graphData, circuitBoard, graphUIVertices, expected) => {
      it ('should attach the expected graph and circuit board data to provided UI vertices', () => {
        const result = SUT.attachDataToGraphUIVertices (graphData) (circuitBoard) (graphUIVertices)
        assert.deepEqual (result, expected)
      })
    })
  })

  describe ('attachDataToGraphUIEdges', () => {
    parametrize ([
      [
        {
          'A': { outputs: [false] },
          'B': { outputs: [true] },
          'C': { outputs: [true, false] },
        },
        [
          { sourceVertexId: 'A', sourceOutputIndex: 0, source: { x: 111, y: 222 }, target: { x: 1110, y: 2220 } },
          { sourceVertexId: 'B', sourceOutputIndex: 0, source: { x: 333, y: 444 }, target: { x: 3330, y: 4440 } },
          { sourceVertexId: 'C', sourceOutputIndex: 0, source: { x: 555, y: 666 }, target: { x: 5550, y: 6660 } },
          { sourceVertexId: 'C', sourceOutputIndex: 1, source: { x: 777, y: 888 }, target: { x: 7770, y: 8880 } },
        ],
        [
          { sourceVertexId: 'A', sourceOutputIndex: 0, source: { x: 111, y: 222 }, target: { x: 1110, y: 2220 }, value: false },
          { sourceVertexId: 'B', sourceOutputIndex: 0, source: { x: 333, y: 444 }, target: { x: 3330, y: 4440 }, value: true },
          { sourceVertexId: 'C', sourceOutputIndex: 0, source: { x: 555, y: 666 }, target: { x: 5550, y: 6660 }, value: true },
          { sourceVertexId: 'C', sourceOutputIndex: 1, source: { x: 777, y: 888 }, target: { x: 7770, y: 8880 }, value: false },
        ],
      ],
    ], (graphData, graphUIEdges, expected) => {
      it ('should attach the expected graph data to provided UI edges', () => {
        const result = SUT.attachDataToGraphUIEdges (graphData) (graphUIEdges)
        assert.deepEqual (result, expected)
      })
    })
  })
})
