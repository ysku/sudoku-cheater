import { sample } from "lodash";
import { Table, N, copyTable, fromValues } from "./sudoku";

/**
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 * [N,N,N,N,N,N,N,N,N],
 */
export type Quiz = {
  id: string;
  table: Table;
}

export const defaultQuizID = "1"

export const quizzes: Array<Quiz> = [
  {
    id: "1",
    table: fromValues([
      [6,4,N,N,N,7,8,N,N],
      [3,N,N,8,N,4,N,N,9],
      [N,N,N,N,N,6,7,N,N],
      [N,9,N,N,N,N,N,N,7],
      [N,N,N,N,7,N,N,N,2],
      [4,N,N,N,N,N,N,1,N],
      [N,5,3,N,N,N,9,4,8],
      [N,N,N,N,N,1,N,N,N],
      [N,8,N,N,5,N,6,N,N],
    ])
  },
  {
    id: "2",
    table: fromValues([
      [N,4,6,N,N,N,5,N,N],
      [N,N,N,5,N,N,4,N,2],
      [1,N,N,7,N,8,N,N,N],
      [9,N,N,N,N,N,N,N,N],
      [N,N,N,8,N,9,6,N,N],
      [N,8,2,N,N,4,N,N,N],
      [N,N,N,N,7,2,N,N,4],
      [4,N,N,N,9,N,N,7,6],
      [N,N,N,N,N,3,N,N,N],
    ])
  },
  {
    id: "3",
    table: fromValues([
      [N,6,9,N,N,1,N,N,N],
      [N,N,N,9,N,N,N,N,N],
      [5,N,N,4,6,N,N,N,N],
      [N,4,N,N,N,N,9,8,N],
      [1,N,N,8,N,7,N,5,N],
      [6,N,7,N,N,3,2,N,N],
      [N,1,N,N,N,2,N,N,5],
      [N,N,N,N,N,N,N,4,N],
      [N,N,N,N,7,N,6,9,N],
    ])
  },
  {
    id: "4",
    table: fromValues([
      [N,5,3,N,N,1,N,N,N],
      [N,N,N,N,7,2,N,8,N],
      [N,1,N,N,N,3,2,N,6],
      [6,N,N,9,N,N,3,N,N],
      [3,N,N,N,N,8,N,N,9],
      [N,N,2,N,N,N,5,N,N],
      [N,2,4,8,N,N,N,N,N],
      [N,8,N,3,N,N,N,N,N],
      [N,N,N,N,N,5,N,2,N],
    ])
  }
]

export const selectQuiz = (id: string): Quiz => {
  for (const quiz of quizzes) {
    if (quiz.id === id) {
      return quiz;
    }
  }
  throw new Error(`quiz not found, ${id}`);
}

export const getRandomQuizID = (currentID: string): string => {
  const picked = sample(quizzes.filter(quiz => quiz.id !== currentID).map(quiz => quiz.id));
  if (!picked) {
    throw new Error()
  }
  return picked;
}

// const completed = [
//   [6,4,9,5,1,7,8,2,3],
//   [3,7,5,8,2,4,1,6,9],
//   [8,2,1,9,3,6,7,5,4],
//   [2,9,6,1,4,5,3,8,7],
//   [5,1,8,6,7,3,4,9,2],
//   [4,3,7,2,9,8,5,1,6],
//   [1,5,3,7,6,2,9,4,8],
//   [9,6,4,3,8,1,2,7,5],
//   [7,8,2,4,5,9,6,3,1],
// ]

export const changeRows = (table: Table, i: number, j: number): Table => {
  const copied = copyTable(table)
  const row1 = copied[i];
  copied[i] = [...copied[j]];
  copied[j] = [...row1];
  return copied;
}

export const changeColumns = (table: Table, i: number, j: number): Table => {
  const copied = copyTable(table)
  const column1 = copied.map(row => row[i]);
  copied.forEach((row, idx) => {
    row[i] = row[j];
    row[j] = column1[idx];
  })
  return copied;
}
