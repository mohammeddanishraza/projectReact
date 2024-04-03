import React, { useState, useEffect } from 'react';
import AddUser from './AddUser'; // Import the AddUser component
import Navbar from './NavBar'; // Import the Navbar component
import { useToken } from './TokenContext';
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import './Users.css';

function Users() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [userDetailsList, setUserDetailsList] = useState([]);
  const { token } = useToken();
  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prevState => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
  };

  const getPasswordDisplay = (user) => {
    return showPassword[user._id] ? unhashPassword(user.user_credential.credential.hash, user.user_credential.credential.salt) : '*****';
  };
  const unhashPassword = (hashedPassword, salt) => {
    const key = CryptoJS.enc.Utf8.parse('1234567890123456');
    const iv = CryptoJS.enc.Utf8.parse(salt);
    const decrypted = CryptoJS.AES.decrypt(hashedPassword, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
   
     // Convert the unhashed password to hex format
    return decrypted;
  };
  
  

  const handleAddUserClick = () => {
    setShowAddUser(true);
  };

  const handleBackClick = () => {
    fetchUserDetails();
    setShowAddUser(false);
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/getUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      if (responseData.status === 'success') {
        setUserDetailsList(responseData.user_records);
        alert(responseData.message);
      } else if(responseData.status === 500) {
        alert(responseData.message);
        window.location.href = '/';
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
  };

  const onViewButton = async(id) => {
    // Handle view button click
  };

  const onDeleteButton = async(id) => {
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token ,user_id:id}),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      if (responseData.status === 'success') {
        alert(responseData.message);
        fetchUserDetails();
      } else if(responseData.status === 500) {
        alert(responseData.message);
        window.location.href = '/';
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
  };
  
  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  return (
    <div>
      <Navbar />
      {!showAddUser ? (
        <div>
          <div className='user-container'>
            <label style={{ color: 'white', fontSize: '30px', fontFamily: 'fantasy' }}>Users</label>
            {userDetailsList.length === 0 ? (
              <label style={{color:'white',fontSize:'25px',marginTop:'40px',fontFamily:'fantasy'}}>No Users added</label>
            ) : (
              userDetailsList.map((user, index) => (
                <div key={index} className='user-details'>
                  <div className='user-info'>
                    <div>
                      <label className='info-label'>{user.name}</label>
                      <p className='info-text'>Name</p>
                    </div>
                    <div>
                      <label className='info-label'>{user.username} </label>
                      <p className='info-text'>Username</p>
                    </div>
                    <div>
                      <label className='info-label'>{user.email}</label>
                      <p className='info-text'>Email</p>
                    </div>
                    <div>
                      <label className='info-label'>{user.mobile}</label>
                      <p className='info-text'>Mobile</p>
                    </div>
                    <div>
                      <label className='info-label'>{user.user_type.name}</label>
                      <p className='info-text'>User type</p>
                    </div>
                    <div>
                      <label className='info-label'>{getPasswordDisplay(user)}</label>
                      <p className='info-text'>Password</p>
                    </div>
                    <div className='image-view'>
                      <button onClick={() => togglePasswordVisibility(user._id)} className='view-btn'>
                        {showPassword[user._id] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className='delete-btn'>
                      <button onClick={() => onDeleteButton(user._id)} className='delete-btn'>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className='redirect-btn' onClick={handleAddUserClick}>Add User</button>
        </div>
      ) : null}
      {showAddUser && (
        <AddUser onBack={handleBackClick} />
      )}
    </div>
  );
}

export default Users;
