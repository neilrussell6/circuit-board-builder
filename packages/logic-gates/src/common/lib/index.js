module.exports = {
    VALUE: v => () => [v],
    ID: v => v,
    NAND: ([a, b]) => [!(a && b)],
    AND: ([a, b]) => [a && b],
    OR: ([a, b]) => [a || b],
    XOR: ([a, b]) => [(a && !b) || (!a && b)],
    NOT: ([a]) => [!a],
    WAY4MUX: ([A, B, C, D, a, b]) => {
        if (!a && !b) {
            return [A]
        }
        if (!a && b) {
            return [B]
        }
        if (a && !b) {
            return [C]
        }
        if (a && b) {
            return [D]
        }
    },
    WAY4DMUX: ([A, a, b]) => {
        if (!a && !b) {
            return [A, false, false, false]
        }
        if (!a && b) {
            return [false, A, false, false]
        }
        if (a && !b) {
            return [false, false, A, false]
        }
        if (a && b) {
            return [false, false, false, A]
        }
    },
}
