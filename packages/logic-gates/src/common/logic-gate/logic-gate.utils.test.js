const { assert } = require ('chai')
const sinon = require ('sinon')
const parametrize = require ('js-parametrize')

const lib = require ('../lib')
const { findParents } = require ('../graph')
const SUT = require ('./logic-gate.utils')

describe ('common/logic-gate/logic-gate.utils', () => {
  let sandbox = null

  beforeEach (async () => {
    sandbox = await sinon.createSandbox ()
  })

  afterEach (async () => {
    await sandbox.restore ()
  })

  describe ('traverseWith', () => {
    parametrize ([
      // simple
      [
        // components
        {
          '0': lib.VALUE (true),
          '1': lib.VALUE (true),
          '2': lib.VALUE (false),
          '3': ([a, b, c]) => [a && b, c],
          '4': lib.ID,
          '5': lib.ID,
        },
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [],
          '1': [],
          '2': [],
          '3': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0]],
          '4': [['3', 0, 0]],
          '5': [['3', 1, 0]],
        },
        // output vertices (traversal starting points)
        ['4', '5'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [true]],
          ['2', [], [false]],
          ['3', [true, true, false], [true, false]],
          ['4', [true], [true]],
          ['5', [false], [false]],
        ],
        // expected output
        [true, false],
      ],
      // -------------------------------
      // 3 gates + splitter (1)
      // -------------------------------
      //
      // [1] --- /-----\
      //         | AND | --- [0]
      // [0] --- \-----/      +---- /-----\      +---- [1]
      //                            | OR  | --- [1]
      //         /-----\      +---- \-----/      +---- [1]
      // [0] --- | NOT | --- [1]
      //         \-----/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0
          lib.VALUE (false), // 1
          lib.AND, // 2
          // NOT
          lib.VALUE (false), // 3
          lib.NOT, // 4
          // OR
          lib.OR, // 5
          // SPLITTERS
          lib.ID, // 6
          lib.ID, // 7
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [],
          '1': [],
          '2': [['0', 0, 0], ['1', 0, 0]],
          '3': [],
          '4': [['3', 0, 0]],
          '5': [['2', 0, 0], ['4', 0, 0]],
          '6': [['5', 0, 0]],
          '7': [['5', 0, 0]],
        },
        // output vertices (traversal starting points)
        ['6', '7'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [false]],
          ['2', [true, false], [false]],
          ['3', [], [false]],
          ['4', [false], [true]],
          ['5', [false, true], [true]],
          ['6', [true], [true]],
          ['7', [true], [true]],
        ],
        // expected output
        [true, true],
      ],

      // -------------------------------
      // 3 gates + splitter (2)
      // -------------------------------
      //
      // [1] --- /-----\
      //         | AND | --- [1]
      // [1] --- \-----/      +---- /-----\      +---- [1]
      //                            | OR  | --- [1]
      //         /-----\      +---- \-----/      +---- [1]
      // [1] --- | NOT | --- [0]
      //         \-----/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0
          lib.VALUE (true), // 1
          lib.AND, // 2
          // NOT
          lib.VALUE (true), // 3
          lib.NOT, // 4
          // OR
          lib.OR, // 5
          // SPLITTERS
          lib.ID, // 6
          lib.ID, // 7
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [],
          '1': [],
          '2': [['0', 0, 0], ['1', 0, 0]],
          '3': [],
          '4': [['3', 0, 0]],
          '5': [['2', 0, 0], ['4', 0, 0]],
          '6': [['5', 0, 0]],
          '7': [['5', 0, 0]],
        },
        // output vertices (traversal starting points)
        ['6', '7'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [true]],
          ['2', [true, true], [true]],
          ['3', [], [true]],
          ['4', [true], [false]],
          ['5', [true, false], [true]],
          ['6', [true], [true]],
          ['7', [true], [true]],
        ],
        // expected output
        [true, true],
      ],

      // -------------------------------
      // 4 WAY MUX (A 1)
      // -------------------------------
      //
      // A [1] --- /-------\
      // B [0] --- |       |
      // C [0] --- | 4 WAY |
      // D [0] --- |  MUX  | --- [1]
      // a [0] --- |       |
      // b [0] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0 A
          lib.VALUE (false), // 1 B
          lib.VALUE (false), // 2 C
          lib.VALUE (false), // 3 D
          lib.VALUE (false), // 4 a
          lib.VALUE (false), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // 6 T
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [false]],
          ['2', [], [false]],
          ['3', [], [false]],
          ['4', [], [false]],
          ['5', [], [false]],
          ['6', [true, false, false, false, false, false], [true]],
        ],
        // expected output
        [true],
      ],
      // -------------------------------
      // 4 WAY MUX (A 0)
      // -------------------------------
      //
      // A [1] --- /-------\
      // B [0] --- |       |
      // C [1] --- | 4 WAY |
      // D [1] --- |  MUX  | --- [0]
      // a [0] --- |       |
      // b [0] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (false), // 0 A
          lib.VALUE (true), // 1 B
          lib.VALUE (true), // 2 C
          lib.VALUE (true), // 3 D
          lib.VALUE (false), // 4 a
          lib.VALUE (false), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // 0 A
          '1': [], // 1 B
          '2': [], // 2 C
          '3': [], // 3 D
          '4': [], // 4 a
          '5': [], // 5 b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [false]],
          ['1', [], [true]],
          ['2', [], [true]],
          ['3', [], [true]],
          ['4', [], [false]],
          ['5', [], [false]],
          ['6', [false, true, true, true, false, false], [false]],
        ],
        // expected output
        [false],
      ],

      // -------------------------------
      // 4 WAY MUX (B 1)
      // -------------------------------
      //
      // A [0] --- /-------\
      // B [1] --- |       |
      // C [0] --- | 4 WAY |
      // D [0] --- |  MUX  | --- [1]
      // a [0] --- |       |
      // b [1] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (false), // 0 A
          lib.VALUE (true), // 1 B
          lib.VALUE (false), // 2 C
          lib.VALUE (false), // 3 D
          lib.VALUE (false), // 4 a
          lib.VALUE (true), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [false]],
          ['1', [], [true]],
          ['2', [], [false]],
          ['3', [], [false]],
          ['4', [], [false]],
          ['5', [], [true]],
          ['6', [false, true, false, false, false, true], [true]],
        ],
        // expected output
        [true],
      ],
      // -------------------------------
      // 4 WAY MUX (B 0)
      // -------------------------------
      //
      // A [1] --- /-------\
      // B [0] --- |       |
      // C [1] --- | 4 WAY |
      // D [1] --- |  MUX  | --- [0]
      // a [0] --- |       |
      // b [1] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0 A
          lib.VALUE (false), // 1 B
          lib.VALUE (true), // 2 C
          lib.VALUE (true), // 3 D
          lib.VALUE (false), // 4 a
          lib.VALUE (true), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [false]],
          ['2', [], [true]],
          ['3', [], [true]],
          ['4', [], [false]],
          ['5', [], [true]],
          ['6', [true, false, true, true, false, true], [false]],
        ],
        // expected output
        [false],
      ],

      // -------------------------------
      // 4 WAY MUX (C 1)
      // -------------------------------
      //
      // A [0] --- /-------\
      // B [0] --- |       |
      // C [1] --- | 4 WAY |
      // D [0] --- |  MUX  | --- [1]
      // a [1] --- |       |
      // b [0] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (false), // 0 A
          lib.VALUE (false), // 1 B
          lib.VALUE (true), // 2 C
          lib.VALUE (false), // 3 D
          lib.VALUE (true), // 4 a
          lib.VALUE (false), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [false]],
          ['1', [], [false]],
          ['2', [], [true]],
          ['3', [], [false]],
          ['4', [], [true]],
          ['5', [], [false]],
          ['6', [false, false, true, false, true, false], [true]],
        ],
        // expected output
        [true],
      ],
      // -------------------------------
      // 4 WAY MUX (C 0)
      // -------------------------------
      //
      // A [1] --- /-------\
      // B [1] --- |       |
      // C [0] --- | 4 WAY |
      // D [1] --- |  MUX  | --- [0]
      // a [1] --- |       |
      // b [0] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0 A
          lib.VALUE (true), // 1 B
          lib.VALUE (false), // 2 C
          lib.VALUE (true), // 3 D
          lib.VALUE (true), // 4 a
          lib.VALUE (false), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [true]],
          ['2', [], [false]],
          ['3', [], [true]],
          ['4', [], [true]],
          ['5', [], [false]],
          ['6', [true, true, false, true, true, false], [false]],
        ],
        // expected output
        [false],
      ],

      // -------------------------------
      // 4 WAY MUX (D 1)
      // -------------------------------
      //
      // A [0] --- /-------\
      // B [0] --- |       |
      // C [0] --- | 4 WAY |
      // D [1] --- |  MUX  | --- [1]
      // a [1] --- |       |
      // b [1] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (false), // 0 A
          lib.VALUE (false), // 1 B
          lib.VALUE (false), // 2 C
          lib.VALUE (true), // 3 D
          lib.VALUE (true), // 4 a
          lib.VALUE (true), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [false]],
          ['1', [], [false]],
          ['2', [], [false]],
          ['3', [], [true]],
          ['4', [], [true]],
          ['5', [], [true]],
          ['6', [false, false, false, true, true, true], [true]],
        ],
        // expected output
        [true],
      ],
      // -------------------------------
      // 4 WAY MUX (D 0)
      // -------------------------------
      //
      // A [1] --- /-------\
      // B [1] --- |       |
      // C [1] --- | 4 WAY |
      // D [0] --- |  MUX  | --- [0]
      // a [1] --- |       |
      // b [1] --- \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0 A
          lib.VALUE (true), // 1 B
          lib.VALUE (true), // 2 C
          lib.VALUE (false), // 3 D
          lib.VALUE (true), // 4 a
          lib.VALUE (true), // 5 b
          lib.WAY4MUX, // 6 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // B
          '2': [], // C
          '3': [], // D
          '4': [], // a
          '5': [], // b
          '6': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0], ['3', 0, 0], ['4', 0, 0], ['5', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['6'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [true]],
          ['2', [], [true]],
          ['3', [], [false]],
          ['4', [], [true]],
          ['5', [], [true]],
          ['6', [true, true, true, false, true, true], [false]],
        ],
        // expected output
        [false],
      ],
      // -------------------------------
      // 4 WAY D MUX (A 1 on 2)
      // -------------------------------
      //
      //           /-------\
      // A [1] --- |       | --- [0]
      // a [1] --- | 4 WAY | --- [0]
      // b [0] --- | D MUX | --- [1]
      //           |       | --- [0]
      //           \-------/
      //
      // -------------------------------
      [
        // components
        [
          // AND
          lib.VALUE (true), // 0 A
          lib.VALUE (true), // 1 a
          lib.VALUE (false), // 2 b
          lib.WAY4DMUX, // 3 OUT
        ],
        // transposed graph (backwards)
        // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
        {
          '0': [], // A
          '1': [], // a
          '2': [], // b
          '3': [['0', 0, 0], ['1', 0, 0], ['2', 0, 0]], // OUT
        },
        // output vertices (traversal starting points)
        ['3'],
        // expected calls
        [
          ['0', [], [true]],
          ['1', [], [true]],
          ['2', [], [false]],
          ['3', [true, true, false], [false, false, true, false]],
        ],
        // expected output
        [false, false, true, false],
      ],
      // // infinite
      // [
      //   // components
      //   [
      //     lib.VALUE (false), // 0
      //     lib.OR, // 1
      //     lib.NOT, // 2
      //   ],
      //   // transposed graph (backwards)
      //   // AdjacencyList { VertexID: [ParentVertexID, ParentOutputIndex, ChildInputIndex] }
      //   {
      //     '0': [],
      //     '1': [['0', 0, 0], ['2', 0, 0]],
      //     '2': [['1', 0, 0]],
      //   },
      //   // output vertices (traversal starting points)
      //   [['2', '0']],
      //   // expected calls
      //   [???],
      //   // expected output
      //   [???],
      // ],
    ], (fs, transposedGraph, start, expectedCalls, expected) => {
      it ('should traverse the provided adjacency list graph depth first from the provided starting point calling back with each node as expected', () => {
        const callbackStub = sandbox.stub ()
        const result = SUT.traverseWith (callbackStub) (fs) (start) (transposedGraph)
        assert.deepEqual (result, expected)
        assert.strictEqual (callbackStub.callCount, expectedCalls.length)
        assert.deepEqual (callbackStub.args, expectedCalls)
      })
    })
  })

  describe ('extractVertexIndices', () => {
    parametrize ([
      [
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
          '7': [['5', 0, 0]],
        },
        '2',
        ['2', '0', '1'],
      ],
      [
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
          '7': [['5', 0, 0]],
        },
        '5',
        ['5', '2', '4', '0', '1', '3'],
      ],
    ], (transposedGraphAL, i, expected) => {
      it ('should return all the parents of the provided vertex given a transposed adjacency list', () => {
        const result = findParents (SUT.extractVertexIndices) (transposedGraphAL) (i)
        assert.deepEqual (result, expected)
      })
    })
  })
})
