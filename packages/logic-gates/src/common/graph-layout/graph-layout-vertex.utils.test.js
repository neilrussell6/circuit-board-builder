const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const SUT = require ('./graph-layout-vertex.utils')

describe ('common/graph-layout/logic-gate.utils', () => {
  describe ('buildVertices', () => {
    parametrize ([
      //  (A/0)         (C/2)
      //   [1] 0 --- 0 /-----\
      //               | AND | [1] 0 --+
      //   [1] 0 --- 1 \-----/         |      (F/5)
      //  (B/1)                        +-- 0 /-----\ [1] 0 --- 0 (G/6)
      //                                     | ID  |
      //                (E/4)          +-- 1 \-----/ [0] 1 --- 0 (H/7)
      //  (D/3)        /-----\         |
      //   [1] 0 --- 0 | NOT | [0] 0 --+
      //               \-----/
      [
        // hspacing
        100,
        // vspacing
        50,
        // graphAL
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
        // dataMap
        {
          '0': {
            label: '',
            type: 'INPUT',
          },
          '1': {
            label: '',
            type: 'INPUT',
          },
          '2': {
            label: 'AND',
            type: 'GATE',
          },
          '3': {
            label: '',
            type: 'INPUT',
          },
          '4': {
            label: 'NOT',
            type: 'GATE',
          },
          '5': {
            label: 'ID',
            type: 'GATE',
          },
          '6': {
            label: '',
            type: 'OUTPUT',
          },
          '7': {
            label: '',
            type: 'OUTPUT',
          },
        },
        // levelVertexMap
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
        // levelVertices
        [
          ['0', '1', '3'], // 0
          ['2', '4'], // 1
          ['5'], // 2
          ['6', '7'], // 3
        ],
        // expected
        [
          // AND
          { id: '0', x: 0, y: -50, label: '', type: 'INPUT' },
          { id: '1', x: 0, y: 0, label: '', type: 'INPUT' },
          { id: '2', x: 100, y: -25, label: 'AND', type: 'GATE' },
          // NOT
          { id: '3', x: 0, y: 50, label: '', type: 'INPUT' },
          { id: '4', x: 100, y: 25, label: 'NOT', type: 'GATE' },
          // ID
          { id: '5', x: 200, y: 0, label: 'ID', type: 'GATE' },
          // OUTPUTS
          { id: '6', x: 300, y: -25, label: '', type: 'OUTPUT' },
          { id: '7', x: 300, y: 25, label: '', type: 'OUTPUT' },
        ],
      ],
    ], (hspacing, vspacing, graphAL, dataMap, levelVertexMap, levelVertices, expected) => {
      it ('should build edges separated by edge spacing at source and target points as expected', () => {
        const result = SUT.buildVertices (hspacing) (vspacing) (graphAL) (dataMap) (levelVertexMap) (levelVertices)
        assert.deepEqual (result, expected)
      })
    })
  })
})
