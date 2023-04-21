import React from 'react';
import { Box, Grid } from "@mui/material"

type SudokuTableCell = {
  value: number | null;
}

type SudokuTable = Array<Array<SudokuTableCell>>

function SudokuTablePage() {
  const initialValues = [
    [6, 4, null, null, null, 7, 8, null, null],
    [3, null, null, 8, null, 4, null, null, 9],
    [null, null, null, null, null, 6, 7, null, null],
    [null, 9, null, null, null, null, null, null, 7],
    [null, null, null, null, 7, null, null, null, 2],
    [4, null, null, null, null, null, null, 1, null],
    [null, 5, 3, null, null, null, 9, 4, 8],
    [null, null, null, null, null, 1, null, null, null],
    [null, 8, null, null, 5, null, 6, null, null],
  ]

  const table: SudokuTable = initialValues.map(row => row.map(value => ({ value })))

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} spacing={1} columns={9}>
        {table.map((row, rowIdx) => row.map((cell, cellIdx) => (
          <Grid xs={1} key={rowIdx} style={{ border: "1px solid black" }}>
            <div key={`${rowIdx}-${cellIdx}`} style={{ textAlign: "center", fontSize: "48px" }}>
              {cell.value || " "}
            </div>
          </Grid>
        )))}
      </Grid>
    </Box>
  )
}

export { SudokuTablePage };
