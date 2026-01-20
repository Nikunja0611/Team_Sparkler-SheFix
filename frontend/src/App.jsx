import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Landing from './pages/Landing'; // Ensure Landing.jsx is in src/pages/
import VideoKYC from './components/VideoKYC';

//Css Imports
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* KYC Verification Route */}
        <Route path="/verify" element={<VideoKYC />} />

        {/* Future Routes (Placeholders) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;