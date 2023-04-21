import React from 'react';
import { Box, Container, Typography } from "@mui/material"
import { SudokuTablePage } from "./SudokuTable";

function App() {
  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ mb: 3 }} textAlign="center">
        <Typography variant='h3'>
          数独 👨‍💻
        </Typography>
      </Box>
      <SudokuTablePage />
    </Container>
  );
}

export default App;
