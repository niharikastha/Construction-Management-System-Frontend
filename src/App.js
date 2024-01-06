import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Signup from './components/Signup';
import ProjectManager from './components/ProjectManager';
import Constructor from './components/Constructor';
import Supervisor from './components/Supervisor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/project" element={<ProjectManager />} />
        <Route path="/contractor" element={<Constructor />} />
        <Route path="/supervisor" element={<Supervisor />} />
      </Routes>
    </Router>
  );
};

export default App;
