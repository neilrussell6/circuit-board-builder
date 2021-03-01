const { assert } = require ('chai')
const sinon = require ('sinon')
const parametrize = require ('js-parametrize')

const SUT = require ('./graph-layout-edge.utils')

describe ('common/graph-layout/logic-gate.utils', () => {
  let sandbox = null

  beforeEach (async () => {
    sandbox = await sinon.createSandbox ()
  })

  afterEach (async () => {
    await sandbox.restore ()
  })

  describe ('buildEdges', () => {
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
        // edgeSpacing
        8,
        // vertices
        [
          // AND
          { id: '0', x: 0, y: -70 },
          { id: '1', x: 0, y: 0 },
          { id: '2', x: 180, y: -35 },
          // NOT
          { id: '3', x: 0, y: 70 },
          { id: '4', x: 180, y: 35 },
          // ID
          { id: '5', x: 360, y: 0 },
          // OUTPUTS
          { id: '6', x: 540, y: -35 },
          { id: '7', x: 540, y: 35 },
        ],
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
        // transposedGraphAL
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
        // expected
        [
          // 0, 1 -> 2 (AND)
          {
            sourceVertexId: '0',
            sourceOutputIndex: 0,
            source: { x: 0, y: -70 },
            target: { x: 180, y: -39 },
          },
          {
            sourceVertexId: '1',
            sourceOutputIndex: 0,
            source: { x: 0, y: 0 },
            target: { x: 180, y: -31 },
          },
          // 2 (AND) -> 5 (ID)
          {
            sourceVertexId: '2',
            sourceOutputIndex: 0,
            source: { x: 180, y: -35 },
            target: { x: 360, y: -4 },
          },
          // 3 -> 4 (NOT)
          {
            sourceVertexId: '3',
            sourceOutputIndex: 0,
            source: { x: 0, y: 70 },
            target: { x: 180, y: 35 },
          },
          // 4 (NOT) -> 5 (ID)
          {
            sourceVertexId: '4',
            sourceOutputIndex: 0,
            source: { x: 180, y: 35 },
            target: { x: 360, y: 4 },
          },
          // 5 (ID) -> 6 (OUTPUT 1), 7 (OUTPUT 2)
          {
            sourceVertexId: '5',
            sourceOutputIndex: 0,
            source: { x: 360, y: -4 },
            target: { x: 540, y: -35 },
          },
          {
            sourceVertexId: '5',
            sourceOutputIndex: 1,
            source: { x: 360, y: 4 },
            target: { x: 540, y: 35 },
          },
        ],
      ],
    ], (edgeSpacing, vertices, graphAL, transposedGraphAL, expected) => {
      it ('should build edges separated by edge spacing at source and target points as expected', () => {
        const result = SUT.buildEdges (edgeSpacing) (vertices) (graphAL) (transposedGraphAL)
        assert.deepEqual (result, expected)
      })
    })
  })
})
