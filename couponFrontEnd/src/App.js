import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './Routes/main';

function App() {
  return (
    <BrowserRouter>
      <MainRoutes></MainRoutes>
    </BrowserRouter>
  );
}

export default App;
