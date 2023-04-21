import { bruteForce, isValid, copyTable, fromValues, goBack, goNext, isAssignable, N, Position, render, Table } from "./sudoku";

describe("goNext", () => {
  test.each<[Position, Position]>([
    [
      [0, 0], [0, 1],
    ],
    [
      [0, 8], [1, 0],
    ],
    [
      [3, 7], [3, 8],
    ],
    [
      [8, 0], [8, 1],
    ]
  ])("%o should go to %o", (current: Position, next: Position) => {
    expect(goNext(current)).toEqual(next);
  })

  test("should return null", () => {
    expect(goNext([8, 8])).toBeNull();
  })
})

describe("goBack", () => {
  test.each<[Position, Position]>([
    [
      [0, 8], [0, 7],
    ],
    [
      [3, 7], [3, 6],
    ],
    [
      [8, 0], [7, 8],
    ],
    [
      [8, 8], [8, 7],
    ]
  ])("%o should go to %o", (current: Position, next: Position) => {
    expect(goBack(current)).toEqual(next);
  })

  test("should return null", () => {
    expect(goBack([0, 0])).toBeNull();
  })
});

test("copyTable", () => {
  const table = fromValues([
    [6, 4, N, N, N, 7, 8, N, N],
    [3, N, N, 8, N, 4, N, N, 9],
    [N, N, N, N, N, 6, 7, N, N],
    [N, 9, N, N, N, N, N, N, 7],
    [N, N, N, N, 7, N, N, N, 2],
    [4, N, N, N, N, N, N, 1, N],
    [N, 5, 3, N, N, N, 9, 4, 8],
    [N, N, N, N, N, 1, N, N, N],
    [N, 8, N, N, 5, N, 6, N, N],
  ]);
  const copy = copyTable(table);
  copy[0][3] = 9
  expect(table[0][3]).toEqual(N);
  copy[2][0] = 9
  expect(table[2][0]).toEqual(N);
})

describe("isAssignable", () => {
  const table = fromValues([
    [6, 4, N, N, N, 7, 8, N, N],
    [3, N, N, 8, N, 4, N, N, 9],
    [N, N, N, N, N, 6, 7, N, N],
    [N, 9, N, N, N, N, N, N, 7],
    [N, N, N, N, 7, N, N, N, 2],
    [4, N, N, N, N, N, N, 1, N],
    [N, 5, 3, N, N, N, 9, 4, 8],
    [N, N, N, N, N, 1, N, N, N],
    [N, 8, N, N, 5, N, 6, N, N],
  ]);

  test.each<[Position, number, boolean]>([
    [[0, 0], 6, false],
    [[0, 2], 5, true],
    [[0, 2], 6, false],
  ])("%o isAssignable should be %t", (pos: Position, num: number, ret: boolean) => {
    expect(isAssignable(table, pos, num)).toEqual(ret);
  })
});

describe("isValid", () => {
  test.each([
    [
      [
        [6, 4, N, N, N, 7, 8, N, N],
        [3, N, N, 8, N, 4, N, N, 9],
        [N, N, N, N, N, 6, 7, N, N],
        [N, 9, N, N, N, N, N, N, 7],
        [N, N, N, N, 7, N, N, N, 2],
        [4, N, N, N, N, N, N, 1, N],
        [N, 5, 3, N, N, N, 9, 4, 8],
        [N, N, N, N, N, 1, N, N, N],
        [N, 8, N, N, 5, N, 6, N, N],
      ],
      true
    ],
    [
      [
        [6, 4, 6, N, N, 7, 8, N, N],
        [3, N, N, 8, N, 4, N, N, 9],
        [N, N, N, N, N, 6, 7, N, N],
        [N, 9, N, N, N, N, N, N, 7],
        [N, N, N, N, 7, N, N, N, 2],
        [4, N, N, N, N, N, N, 1, N],
        [N, 5, 3, N, N, N, 9, 4, 8],
        [N, N, N, N, N, 1, N, N, N],
        [N, 8, N, N, 5, N, 6, N, N],
      ],
      false
    ]
  ])("%o should be %t", (t: Table, result: boolean) => {
    expect(isValid(t)).toBe(result);
  })
})

describe("bruteForce", () => {
  test.skip("should solve", () => {
    const table = fromValues([
      [6, 4, N, N, N, 7, 8, N, N],
      [3, N, N, 8, N, 4, N, N, 9],
      [N, N, N, N, N, 6, 7, N, N],
      [N, 9, N, N, N, N, N, N, 7],
      [N, N, N, N, 7, N, N, N, 2],
      [4, N, N, N, N, N, N, 1, N],
      [N, 5, 3, N, N, N, 9, 4, 8],
      [N, N, N, N, N, 1, N, N, N],
      [N, 8, N, N, 5, N, 6, N, N],
    ]);
    render(bruteForce(table, [0, 0]));
  })
})
