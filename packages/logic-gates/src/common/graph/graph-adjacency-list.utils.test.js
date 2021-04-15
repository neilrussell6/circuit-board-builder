const { assert } = require ('chai')
const sinon = require ('sinon')
const parametrize = require ('js-parametrize')
const { identity } = require ('ramda')

const SUT = require ('./graph-adjacency-list.utils')

describe ('common/graph/graph-adjacency-list.utils', () => {
  let sandbox = null

  beforeEach (async () => {
    sandbox = await sinon.createSandbox ()
  })

  afterEach (async () => {
    await sandbox.restore ()
  })

  describe ('transposeGraphAdjacencyList', () => {
    parametrize ([
      [
        // graph AL
        {
          // AND
          '0': [['2', 0, 0]],
          '1': [['2', 0, 1]],
          '2': [['5', 0, 0]],
          // NOT
          '3': [['4', 0, 0]],
          '4': [['5', 0, 1]],
          // ID
          '5': [['6', 0, 0], ['7', 1, 0]],
          // OUTPUTS
          '6': [],
          '7': [],
        },
        // expected
        {
          // AND
          '0': [],
          '1': [],
          '2': [['0', 0, 0], ['1', 0, 1]],
          // NOT
          '3': [],
          '4': [['3', 0, 0]],
          // OR
          '5': [['2', 0, 0], ['4', 0, 1]],
          // OUTPUTS
          '6': [['5', 0, 0]],
          '7': [['5', 1, 0]],
        },
      ],
    ], (graphAL, expected) => {
      it ('should transpose the provided graph adjacency list as expected', () => {
        const result = SUT.transposeGraphAdjacencyList (graphAL)
        assert.deepEqual (result, expected)
        const result2 = SUT.transposeGraphAdjacencyList (result)
        assert.deepEqual (graphAL, result2)
      })
    })
  })

  describe ('calculateGraphLevels', () => {
    parametrize ([
      [
        {
          // AND
          '0': [['2', 0, 0]],
          '1': [['2', 0, 1]],
          '2': [['5', 0, 0]],
          // NOT
          '3': [['4', 0, 0]],
          '4': [['5', 0, 1]],
          // ID
          '5': [['6', 0, 0], ['7', 1, 0]],
          // OUTPUTS
          '6': [],
          '7': [],
        },
        ['0', '1', '3'],
        {
          // AND
          '0': 0,
          '1': 0,
          '2': 1,
          // NOT
          '3': 0,
          '4': 1,
          // ID
          '5': 2,
          // OUTPUTS
          '6': 3,
          '7': 3,
        },
      ],
    ], (graphAL, start, expected) => {
      it ('should calculate the level of each vertex in the provided graph adjacency list', () => {
        const result = SUT.calculateGraphLevels (start) (graphAL)
        assert.deepEqual (result, expected)
      })
    })
  })

  describe ('sortGraphLevelToVertexIdMap', () => {
    parametrize ([
      // -------------------------
      // INPUT
      // -------------------------
      // A --(0)
      //      +--- D --(0)
      // B --(1)        +--- F
      // C --(0)-- E --(0)
      // -------------------------
      [
        // graph AL
        {
          'A': [['D', 0, 0]],
          'B': [['D', 0, 1]],
          'C': [['E', 0, 0]],
          'D': [['F', 0, 0]],
          'E': [['F', 0, 0]],
          'F': [],
        },
        // level to vertex map
        [
          ['A', 'B', 'C'], // 0
          ['D', 'E'], // 1
          ['F'], // 2
        ],
        // expected
        [
          ['A', 'B', 'C'], // 0
          ['D', 'E'], // 1
          ['F'], // 2
        ],
      ],
      [
        // graph AL
        {
          'A': [['D', 0, 1]],
          'B': [['D', 0, 0]],
          'C': [['E', 0, 0]],
          'D': [['F', 0, 0]],
          'E': [['F', 0, 0]],
          'F': [],
        },
        // level to vertex map
        [
          ['A', 'B', 'C'], // 0
          ['D', 'E'], // 1
          ['F'], // 2
        ],
        // expected
        [
          ['B', 'A', 'C'], // 0
          ['D', 'E'], // 1
          ['F'], // 2
        ],
      ],
      [
        // graph AL
        {
          'A': [['D', 0, 0]],
          'B': [['D', 0, 1]],
          'C': [['E', 0, 0]],
          'D': [['F', 0, 0]],
          'E': [['F', 0, 0]],
          'F': [],
        },
        // level to vertex map
        [
          ['C', 'B', 'A'], // 0
          ['D', 'E'], // 1
          ['F'], // 2
        ],
        // expected
        [
          ['A', 'B', 'C'], // 0
          ['D', 'E'], // 1
          ['F'], // 2
        ],
      ],
      [
        // graph AL
        {
          'A': [['D', 0, 0]],
          'B': [['D', 0, 1]],
          'C': [['E', 0, 0]],
          'D': [['F', 0, 0]],
          'E': [['F', 0, 0]],
          'F': [],
        },
        // level to vertex map
        [
          ['A', 'B', 'C'], // 0
          ['E', 'D'], // 1
          ['F'], // 2
        ],
        // expected
        [
          ['C', 'A', 'B'], // 0
          ['E', 'D'], // 1
          ['F'], // 2
        ],
      ],

      // -------------------------
      // INPUT
      // -------------------------
      // X --(0)-- Y --(0)
      //                +--- F
      // C --(0)-- E --(1)
      // -------------------------
      [
        // graph AL
        {
          'C': [['E', 0, 0]],
          'E': [['F', 0, 1]],
          'F': [],
          'X': [['Y', 0, 0]],
          'Y': [['F', 0, 0]],
        },
        // level to vertex map
        [
          ['C', 'X'], // 0
          ['Y', 'E'], // 1
          ['F'], // 2
        ],
        // expected
        [
          ['X', 'C'], // 0
          ['Y', 'E'], // 1
          ['F'], // 2
        ],
      ],
    ], (graphAL, levelVertexMap, expected) => {
      it ('should sort map of levels to vertex ids so that parents are grouped correctly', () => {
        const result = SUT.sortGraphLevelToVertexIdMap (graphAL) (levelVertexMap)
        assert.deepEqual (result, expected)
      })
    })
  })

  describe ('bfs', () => {
    it ('should ...', () => {
      // TODO: test
    })
  })
})
