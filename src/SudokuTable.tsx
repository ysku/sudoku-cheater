import React, { useState } from 'react';
import { Box, Button, CircularProgress, Container, Grid } from "@mui/material"
import { Table, N, fromValues, renderCell, bruteForce} from "./lib/sudoku";

function Loading() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

function SudokuTable({
  table
}: {
  table: Table
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} spacing={1} columns={9}>
        {table.map((row, rowIdx) => row.map((cell, cellIdx) => (
          <Grid item xs={1} key={`${rowIdx}-${cellIdx}`} style={{ border: "1px solid black" }}>
            <div style={{ textAlign: "center", fontSize: "48px" }}>
              {renderCell(cell)}
            </div>
          </Grid>
        )))}
      </Grid>
    </Box>
  )
}

function SudokuTablePage() {
  const initialValues = [
    [6, 4, N, N, N, 7, 8, N, N],
    [3, N, N, 8, N, 4, N, N, 9],
    [N, N, N, N, N, 6, 7, N, N],
    [N, 9, N, N, N, N, N, N, 7],
    [N, N, N, N, 7, N, N, N, 2],
    [4, N, N, N, N, N, N, 1, N],
    [N, 5, 3, N, N, N, 9, 4, 8],
    [N, N, N, N, N, 1, N, N, N],
    [N, 8, N, N, 5, N, 6, N, N],
  ]
  const [table, setTable] = useState<Table>(fromValues(initialValues))
  const [done, setDone] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number | null>(null);

  const handleStartClick = () => {
    const start = performance.now();
    setProcessing(true);
    const result = bruteForce(table, [0, 0]);
    setTable(result);
    setElapsedSec(Math.round((performance.now() - start) / 1000));
    setDone(true);
    setProcessing(false);
    console.log("completed!!");
  }

  const handleStopClick = () => {
    setDone(false);
    setProcessing(false);
  }

  const handleRefreshClick = () => {
    setTable(fromValues(initialValues));
  }

  return (
    <Container>
      {processing && <Loading/>}
      <SudokuTable table={table} />
      {elapsedSec && (
        <Box width="100%" textAlign="center" sx={{ mt: 3 }}>
          finished in {elapsedSec} seconds
        </Box>
      )}
      <Box width="100%" textAlign="center" sx={{ mt: 3 }}>
        {!processing ? (
          <Button onClick={handleStartClick} disabled={processing}>
            Start
          </Button>
        ) : (
          <Button onClick={handleStopClick} disabled={done}>
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
