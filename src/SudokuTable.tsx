import React, { useEffect, useMemo, useState } from 'react';
import { Backdrop, Box, Button, CircularProgress, Container, Grid } from "@mui/material"
import { Table, N, fromValues, renderCell, copyTable, render, isCompleted, isValid } from "./lib/sudoku";
import { algorithms, Request, Response } from './lib/types';

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

function SudokuTablePage() {
  const initialTable = fromValues([
    [6, 4, N, N, N, 7, 8, N, N],
    [3, N, N, 8, N, 4, N, N, 9],
    [N, N, N, N, N, 6, 7, N, N],
    [N, 9, N, N, N, N, N, N, 7],
    [N, N, N, N, 7, N, N, N, 2],
    [4, N, N, N, N, N, N, 1, N],
    [N, 5, 3, N, N, N, 9, 4, 8],
    [N, N, N, N, N, 1, N, N, N],
    [N, 8, N, N, 5, N, 6, N, N],
  ])
  const [table, setTable] = useState<Table>(initialTable);
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
    setTable(initialTable);
    setMessages(defaultMessages);
    setProcessing(false);
  }

  const createOnChangeHandler = (x: number, y: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`event`, event);
      const value = event.target.value;
      if (!value) {
        const copied = copyTable(table)
        copied[x][y] = null;
        setTable(copied);
        return;
      }
      const num = parseInt(value);
      if (isNaN(num)) {
        // TODO: validation and error report
        return;
      }
      const copied = copyTable(table)
      copied[x][y] = num;
      if (!isValid(copied)) {
        // TODO: error report
        console.error("not valid table")
      }
      setTable(copied);
      console.log(render(copied));
    }
  }

  return (
    <Container>
      <Box width="100%" textAlign="center" sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} spacing={1} columns={9}>
          {table.map((row, rowIdx) => row.map((cell, cellIdx) => (
            <Grid item xs={1} key={`${rowIdx}-${cellIdx}`} style={{ border: "1px solid black" }}>
              <div style={{ textAlign: "center", fontSize: "48px" }}>
                <input
                  style={{
                    width: "1.5em",
                    height: "2em",
                    position: "relative",
                    top: "-1em",
                    left: "-0.5em",
                    paddingLeft: "0.5em",
                    color: initialTable[rowIdx][cellIdx] !== null ? "#020310" : "#48b9a8",
                    fontSize: "14px",
                    border: "none",
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
      </Box>
    </Container>
  )
}

export { SudokuTablePage };
