import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './NavBar';
import CryptoJS from 'crypto-js';
import './AddUser.css'
import { useToken } from './TokenContext';

function AddUser({ onBack }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [password, setPassword] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { token } = useToken();
  const fixedIV = CryptoJS.enc.Utf8.parse('0123456789012345');

  useEffect(() => {
    validateForm();
  }, [name, username, mobile, email, userType, password, mobileError, emailError]);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
  };
  
  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
  };
  
  const handleMobileChange = (event) => {
    const value = event.target.value;
    setMobile(value);
    validateMobile(value);
  };

  const validateMobile = (value) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(value)) {
      setMobileError('Invalid mobile number');
    } else {
      setMobileError('');
    }
  };
  
  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handleUserTypeChange = (event) => {
    const value = event.target.value;
    setUserType(value);
  };
  
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleSubmit = async () => {
    setButtonEnabled(false);
    const salt = generateRandomString(16);
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
    const formData = new FormData();
      formData.append('token', token);
      formData.append('name', name);
      formData.append('username', username);
      formData.append('salt', hashedData.salt);
      formData.append('password', hashedData.passwordHash);
      formData.append('mobile', mobile);
      formData.append('email', email);
      formData.append('user_type_code', userType);


    console.log("Salt:", hashedData.salt);
    console.log("Password Hash:", hashedData.passwordHash);
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/addUser', {
        method: 'POST',
        body:formData, // Send username in the request body
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      console.log(responseData);
      
      if (responseData.status === 'success') {
   
        alert( responseData.message);
        onBack();

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
  

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const mobilePattern = /^[6-9]\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isMobileValid = mobilePattern.test(mobile);
    const isEmailValid = emailPattern.test(email);

    if (name && username && isMobileValid && isEmailValid && userType && password && !mobileError && !emailError) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className='adduser-container'>
      <button
  type="button"
  className="back-button"
  // Adjust left if needed
  onClick={handleBackClick}
>
  Back
</button>

        <div className='adduser'>
          <p className="adduser-text">New User</p>
          <input
            type="text"
            placeholder='Name'
            className='adduser-input'
            value={name}
            onChange={handleNameChange}
          />
          <input
            type="text"
            placeholder='Username'
            className='adduser-input'
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            type="number"
            placeholder='Mobile Number'
            className='adduser-input'
            value={mobile}
            onChange={handleMobileChange}
          />
          {mobileError && <span className="error-text">{mobileError}</span>}

          <input
            type="text"
            placeholder='Email'
            className='adduser-input'
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <span className="error-text">{emailError}</span>}

          <div className="radio-container">
            <div>
              <label>
                <input
                  type="radio"
                  value="ADMIN"
                  name="userType"
                  className='radio-input'
                  onChange={handleUserTypeChange}
                />
                Admin
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="USER"
                  name="userType"
                  className='radio-input'
                  onChange={handleUserTypeChange}
                />
                User
              </label>
            </div>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            className='adduser-input'
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
            className="adduser-button"
            disabled={!buttonEnabled}
            onClick={handleSubmit}
          >
            Add User
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default AddUser;
