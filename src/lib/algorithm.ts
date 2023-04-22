/* eslint-disable no-restricted-globals */
import { algorithms, Request, Response } from "./types";
import { bruteForce } from "./sudoku";

self.onmessage = (e: MessageEvent<string>) => {
  const request = JSON.parse(e.data) as Request;
  console.log("onmessage", request);
  if (request.action === algorithms.bruteForce) {
    console.log(`start algorithm`);
    const table = request.table;
    const result = bruteForce(table, [0, 0]);
    const response: Response = {
      table: result,
      elapsedSec: Math.round((Date.now() - request.startTime) / 1000),
    }
    self.postMessage(JSON.stringify(response));
  }
}

export {};
