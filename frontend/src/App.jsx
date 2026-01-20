import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Landing from './pages/Landing'; 
import Login from './pages/Login';
import Register from './pages/Register';
import VideoKYC from './components/VideoKYC';

//Css Imports
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        
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