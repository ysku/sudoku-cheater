import { Table } from "./sudoku";

export enum algorithms {
  bruteForce = "bruteForce"
}

export type Request = {
  action: string;
  table: Table;
  startTime: number;
}

export type Response = {
  table: Table;
  elapsedSec: number;
}
