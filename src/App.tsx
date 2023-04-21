import React from 'react';
import { Container } from "@mui/material"
import { SudokuTablePage } from "./SudokuTable";

function App() {
  return (
    <div className="App">
      <Container>
        <SudokuTablePage />
      </Container>
    </div>
  );
}

export default App;
