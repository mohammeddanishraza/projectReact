// TokenContext.js
import React, { createContext, useState, useContext } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');

  const updateToken = (newToken) => {
    setToken(newToken);
  };

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
  };
  const updateUserType= (newUserType) => {
    setUserType(newUserType);
  };


  return (
    <TokenContext.Provider value={{ token, updateToken, username, updateUsername,userType,updateUserType }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
