import { flatten } from "lodash";

export const N = null;

type Cell = number | null;

export type Position = [number, number];

export type Table = Array<Array<Cell>>

export const fromValues = (values: Array<Array<number | null>>): Table => {
  return values;
}

export const copyTable = (table: Table): Table => {
  return table.map(row => ([...row]));
}

export const renderCell = (cell: Cell) => {
  if (cell !== null) {
    return cell.toString();
  }
  return " ";
}

export const render = (table: Table) => {
  const lines: Array<string> = [];
  table.forEach(row => {
    lines.push(row.map(renderCell).join(" | "))
  })
  console.log(lines.join("\n"));
}

const MaxX = 8;
const MaxY = 8;

const isNotNull = (v: number | null): v is number => {
  return v !== null;
}

const getRowValues = (table: Table, x: number): Array<number> => {
  return table[x].filter(isNotNull);
}

const getColumnValues = (table: Table, y: number): Array<number> => {
  const items: Array<number> = [];
  for (let i = 0; i < table.length; i++) {
    const v = table[i][y];
    if (isNotNull(v)) {
      items.push(v);
    }
  }
  return items;
}

export const isAssignable = (table: Table, pos: Position, num: number) => {
  const [x, y] = pos;
  if (table[x][y] !== null) {
    return false;
  }
  if (getRowValues(table, x).includes(num)) {
    return false;
  }
  if (getColumnValues(table, y).includes(num)) {
    return false;
  }
  return true;
}

export const canEnter = (table: Table, pos: Position, num: number): Array<Position> => {
  const [x, y] = pos;
  if (table[x][y] !== null) {
    return [pos];
  }
  const notNull = (v: Position | null): v is Position => v !== null;
  let violations: Array<Position> = []
  violations = violations.concat(table[x].map((v, idx) => v === num ? [x, idx] as Position : null).filter(notNull));

  for (let i = 0; i < 9; i++) {
    if (table[i][y] === num) {
      violations.push([i, y]);
    }
  }
  return violations;
}

export const isBlank = (table: Table, pos: Position): boolean => {
  const [x, y] = pos;
  return table[x][y] === null;
}

const hasDuplicate = (values: Array<number>): boolean => {
  const s = new Set(values);
  return s.size !== values.length;
}

const isValidBlock = (table: Table, pos: Position): boolean => {
  const [x, y] = pos;
  const values: Array<number> = [];
  for (let i = x; i < x + 3; i++) {
    for (let j = y; j < y + 3; j++) {
      const value = table[i][j]
      if (value) {
        values.push(value);
      }
    }
  }
  return !hasDuplicate(values);
}

const isValidBlocks = (table: Table): boolean => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!isValidBlock(table, [i*3, j*3])) {
        return false;
      }
    }
  }
  return true;
}

export const isValid = (table: Table): boolean => {
  for (let i = 0; i <= MaxX; i++) {
    if (hasDuplicate(getRowValues(table, i))) {
      return false;
    }
  }
  for (let j = 0; j <= MaxY; j++) {
    if (hasDuplicate(getColumnValues(table, j))) {
      return false;
    }
  }
  return isValidBlocks(table);
}

export const isCompleted = (table: Table): boolean => {
  return isValid(table) && flatten(table).every(isNotNull);
}

export const goNext = (pos: Position): Position | null => {
  let [nextX, nextY] = pos;
  nextY++;
  if (nextY > MaxY) {
    nextX++;
    nextY = 0;
  }
  if (nextX > MaxX) {
    return null;
  }
  return [nextX, nextY];
}

export const goBack = (pos: Position): Position | null => {
  let [nextX, nextY] = pos;
  nextY--;
  if (nextY <= 0) {
    nextX--;
    nextY = MaxY;
  }
  if (nextX < 0) {
    return null;
  }
  return [nextX, nextY];
}

export const nearestBlock = (pos: Position): Position => {
  const [x, y] = pos;
  return [Math.floor(x / 3) * 3, Math.floor(y / 3) * 3];
}

const getCurrentBlock = (table: Table, pos: Position): Array<Array<Cell>> => {
  const [xi, yi] = nearestBlock(pos);
  const block: Array<Array<Cell>> = [];
  for (let i = xi; i < xi + 3; i++) {
    block.push(table[i].slice(yi, yi + 3))
  }
  return block;
}

export const getPossibleValues = (table: Table, pos: Position): Array<number> => {
  const block = getCurrentBlock(table, pos);
  const used = flatten(block).filter(isNotNull);
  const unused: Array<number> = [];
  for (let i = 1; i < 10; i++) {
    if (!used.includes(i) && isAssignable(table, pos, i)) {
      unused.push(i);
    }
  }
  return unused;
}

export const bruteForce = (table: Table, pos: Position): Table => {
  const stack: Array<[Table, Position]> = [[copyTable(table), pos]];

  while (stack.length > 0) {
    const current = stack.shift();
    if (!current) {
      throw new Error("empty stack");
    }
    const [currentTable, currentPos] = current;
    if (isBlank(currentTable, currentPos)) {
      const possibleValues = getPossibleValues(currentTable, currentPos);
      console.log(`visiting ${currentPos}, possible values: ${possibleValues}`);
      for (const i of possibleValues) {
        if (isAssignable(currentTable, currentPos, i)) {
          const [x, y] = currentPos;
          const nextTable = copyTable(currentTable);
          nextTable[x][y] = i;
          if (isValid(nextTable)) {
            const next = goNext(currentPos);
            if (!next) {
              console.log(`no more for next, ${currentPos}`);
              return nextTable;
            }
            stack.push([nextTable, next]);
          }
        }
      }
      if (stack.length === 0) {
        console.log(`currentPos: ${currentPos}, empty stack`)
        return currentTable;
      }
    } else {
      const next = goNext(currentPos);
      if (!next) {
        return currentTable;
      }
      console.log(`go to ${next}`);
      stack.push([currentTable, next]);
    }
  }

  throw new Error();
}
