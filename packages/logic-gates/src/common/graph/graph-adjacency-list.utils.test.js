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

  describe ('buildVertexIndexToLevelMap', () => {
    parametrize ([
      [
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
        [
          ['0', '1', '3'], // 0
          ['2', '4'], // 1
          ['5'], // 2
          ['6', '7'], // 3
        ],
      ],
    ], (levels, expected) => {
      it ('should build a map of levels to vertex indices', () => {
        const result = SUT.buildGraphLevelToVertexIndexMap (levels)
        assert.deepEqual (result, expected)
      })
    })
  })

  describe ('bfs', () => {
    it ('should ...', () => {
      // TODO: test
    })
  })

  describe ('findParents', () => {
    parametrize ([
      [
        {
          // AND
          '0': [],
          '1': [],
          '2': ['0', '1'],
          // NOT
          '3': [],
          '4': ['3'],
          // OR
          '5': ['2', '4'],
          // OUTPUTS
          '6': ['5'],
          '7': ['5'],
        },
        '2',
        ['2', '0', '1'],
      ],
      [
        {
          // AND
          '0': [],
          '1': [],
          '2': ['0', '1'],
          // NOT
          '3': [],
          '4': ['3'],
          // OR
          '5': ['2', '4'],
          // OUTPUTS
          '6': ['5'],
          '7': ['5'],
        },
        '5',
        ['5', '2', '4', '0', '1', '3'],
      ],
    ], (graphAL, i, expected) => {
      it ('should return all the parents of the provided vertex given a transposed adjacency list', () => {
        const result = SUT.findParents (identity) (graphAL) (i)
        assert.deepEqual (result, expected)
      })
    })
  })
})
