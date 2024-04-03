import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fixedIV = CryptoJS.enc.Utf8.parse('0123456789012345');

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

  const handleSubmit = async () => {
    setButtonEnabled(false);
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/getSalt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.toLowerCase() }), // Send username in the request body
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      console.log(responseData);
      
      if (responseData.status === 'success') {
        const salt = responseData.salt;
        const hashPassword = (password, salt) => {
          const key = CryptoJS.enc.Utf8.parse('1234567890123456');
          const iv = CryptoJS.enc.Utf8.parse(salt);
          const passwordHash =  CryptoJS.AES.encrypt(password, key, { iv: iv }).toString();
          
                    return {
            salt: salt,
            passwordHash: passwordHash
          };
        };
        
        // Usage example:
        const hashedData = hashPassword(password, salt);
        console.log("Salt:", hashedData.salt);
        console.log("Password Hash:", hashedData.passwordHash);
        //alert("Salt: " +  hashedData.passwordHash);
      login(username,hashedData.passwordHash);

        
        // Further handling of the salt value if needed
      } else {
        alert( responseData.message);
        setButtonEnabled(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Server error");
      setButtonEnabled(true);

    }
  };
  
  
const login = async(username,hash) => {
  try {
    const response = await fetch('http://13.232.227.222:3000/mediproc/major/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username.toLowerCase(),password:hash }), // Send username in the request body
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const responseData = await response.json();
    console.log(responseData);
    
    if (responseData.status === 'success') {
      
      alert( responseData.message);
      window.location.href = '/upload?token='+responseData.user_session.token+'&username='+responseData.user.name+'&userType='+responseData.user_type.code;

    } else {
      alert( responseData.message);
      setButtonEnabled(true);

    }
  } catch (error) {
    console.error('Error:', error);
    setButtonEnabled(true);

    alert("Server error");
  }
}
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
        <p className="login-text">Login</p>
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
          type="button" // Change to type="button" to prevent form submission
          className="login-button"
          disabled={!buttonEnabled}
          onClick={handleSubmit}
        >
          Login
        </button>
        
      </div>
    </div>
  );  
}

export default LoginForm;
