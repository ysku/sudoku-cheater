import React, { useEffect, useMemo, useState } from 'react';
import { Backdrop, Box, Button, CircularProgress, Container, Grid } from "@mui/material"
import { Table, renderCell, copyTable, render, isCompleted, Position, canEnter } from "./lib/sudoku";
import { algorithms, Request, Response } from './lib/types';
import { Quiz, defaultQuizID, getRandomQuizID, selectQuiz } from './lib/quiz';

function Loading({ open }: { open: boolean }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

const defaultMessages = [
  `please press start to let this solve this pazzle.`
]

type StateError = {
  violations: Array<Position>;
}

function SudokuTablePage() {
  const [quiz, setQuiz] = useState<Quiz>(selectQuiz(defaultQuizID));
  const [table, setTable] = useState<Table>(quiz.table);
  const [stateError, setStateError] = useState<StateError>({
    violations: [],
  });
  const [miss, setMiss] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<string>>(defaultMessages);

  const algorithm: Worker = useMemo(
    () => new Worker(new URL("./lib/algorithm.ts", import.meta.url)),
    []
  );

  const completed = isCompleted(table);

  console.log(`completed: ${completed}`);

  useEffect(() => {
    if (window.Worker) {
      algorithm.onmessage = (e: MessageEvent<string>) => {
        console.log("algorithm.onmessage", e);
        const response = JSON.parse(e.data) as Response;
        console.log(JSON.stringify(response.table));
        setTable(response.table);
        setMessages([
          `finished in ${response.elapsedSec} seconds.`,
          `please press REFRESH to try it again.`
        ]);
        setProcessing(false);
      };
    }
  }, [algorithm]);

  const handleStartClick = () => {
    const start = Date.now();
    setProcessing(true);
    algorithm.postMessage(JSON.stringify({
      action: algorithms.bruteForce,
      table: table,
      startTime: start
    } as Request));
  }

  const handleStopClick = () => {
    setProcessing(false);
  }

  const handleRefreshClick = () => {
    setProcessing(true);
    setTable(quiz.table);
    setMessages(defaultMessages);
    setMiss(0);
    setProcessing(false);
  }

  const handleNextQuizClick = () => {
    const nextQuizID = getRandomQuizID(quiz.id);
    const nextQuiz = selectQuiz(nextQuizID);
    setQuiz(nextQuiz);
    setTable(nextQuiz.table);
  }

  const createOnChangeHandler = (x: number, y: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`event`, event);
      const value = event.target.value;
      let num: number | null = null;
      if (value) {
        num = parseInt(value);
        if (isNaN(num)) {
          num = null;
        }
      }
      const copied = copyTable(table)
      copied[x][y] = num;
      setTable(copied);
      const violations = num !== null ? canEnter(table, [x, y], num) : [];
      if (violations.length > 0) {
        setMiss(miss + 1);
      }
      setStateError({
        violations,
      })
      console.log(render(copied));
    }
  }

  const bgColor = (pos: Position, violations: Array<Position>): string | undefined => {
    const [x, y] = pos;
    for (const violation of violations) {
      const [vx, vy] = violation;
      if (x === vx && y === vy) {
        return "#fa908a";
      }
    }
    return;
  }

  const color = (original: Table, pos: Position): string => {
    const [x, y] = pos;
    return original[x][y] !== null ? "#020310" : "#48b9a8"
  }

  console.log(stateError);

  return (
    <Container>
      <Box width="100%" textAlign="center" sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} spacing={1} columns={9}>
          {table.map((row, rowIdx) => row.map((cell, cellIdx) => (
            <Grid
              item
              xs={1}
              key={`${rowIdx}-${cellIdx}`}
              style={{
                border: "1px solid black",
                backgroundColor: bgColor([rowIdx, cellIdx], stateError.violations),
              }}
            >
              <div style={{ textAlign: "center", fontSize: "48px" }}>
                <input
                  style={{
                    width: "1.5em",
                    height: "2em",
                    position: "relative",
                    top: "-1em",
                    left: "-0.5em",
                    paddingLeft: "0.5em",
                    color: color(quiz.table, [rowIdx, cellIdx]),
                    fontSize: "14px",
                    border: "none",
                    backgroundColor: bgColor([rowIdx, cellIdx], stateError.violations),
                  }}
                  value={renderCell(cell)}
                  onChange={createOnChangeHandler(rowIdx, cellIdx)}
                />
              </div>
            </Grid>
          )))}
          <Loading open={processing}/>
        </Grid>
      </Box>
      <Box width="100%" textAlign="center" sx={{ mt: 3 }}>
        <p>missed {miss} times</p>
      </Box>
      {messages && (
        <Box width="100%" textAlign="center" sx={{ mt: 3 }}>
          {messages.map((message, idx) => (
            <p key={idx}>{message}</p>
          ))}
        </Box>
      )}
      <Box width="100%" textAlign="center" sx={{ mt: 3 }}>
        {!processing ? (
          <Button onClick={handleStartClick} disabled={processing || completed}>
            Start
          </Button>
        ) : (
          <Button onClick={handleStopClick} disabled={!processing}>
            Stop
          </Button>
        )}
        <Button onClick={handleRefreshClick}>
          Refresh
        </Button>
        <Button onClick={handleNextQuizClick}>
          Next Quiz
        </Button>
      </Box>
    </Container>
  )
}

export { SudokuTablePage };
