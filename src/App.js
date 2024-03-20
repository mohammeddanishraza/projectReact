// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignupForm';

function App() {
  return (
    <Router>
      <div className='container'>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

      </Routes>
      </div>
    </Router>
  );
}

export default App;
