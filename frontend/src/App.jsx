import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';     // <--- NEW
import SkillAcademy from './pages/SkillAcademy'; // <--- NEW
import VideoKYC from './components/VideoKYC';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VideoKYC />} />
        
        {/* New Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/academy" element={<SkillAcademy />} />
      </Routes>
    </Router>
  );
}

export default App;