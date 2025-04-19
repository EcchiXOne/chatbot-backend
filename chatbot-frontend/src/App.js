import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/" element={<ChatInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;