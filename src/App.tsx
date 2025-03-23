import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VerifyIdentity from './pages/VerifyIdentity';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/docauth/:custId" element={<VerifyIdentity />} />
    </Routes>
  );
}

export default App;
