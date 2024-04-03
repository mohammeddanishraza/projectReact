// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import UploadForm from './UploadForm';
import PatientHistory from './PatientHistory';
import Users from './Users';
import { TokenProvider } from './TokenContext';



function App() {
  return (
    <TokenProvider>
    <Router>
      <div >
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/patients" element={<PatientHistory />} />
        <Route path="/users" element={<Users />} />

      </Routes>
      </div>
    </Router>
    </TokenProvider>
  );
}

export default App;
