import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './SignupForm.css';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
    validateForm(value, password);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    validateForm(username, value);
  };
  const handleSubmit = () => {
   alert("Username: "+username+"\nPassword: "+password);

  };

  const validateForm = (username, password) => {
    if (username.length !== 0 && password.length !== 0)
      setButtonEnabled(true);
    else
      setButtonEnabled(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='container'>
      <div className='login'>
        <p className="login-text">Signup</p>
        <input
          type="text"
          placeholder='Username'
          className='login-input'
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder='Password'
          className='login-input'
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="button"
          className="show-hide-button"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        <button
          type="submit"
          className="login-button"
          disabled={!buttonEnabled}
          onClick={handleSubmit}
        >
          Login
        </button>
        <div className='signin'>
          <p>New user?</p>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
