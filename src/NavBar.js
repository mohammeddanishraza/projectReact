import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css'; // Import CSS file for styling
import logoutIcon from './images/logout-icon.png'; // Import logout icon image
import { useToken } from './TokenContext';

function NavBar() {
  const location = useLocation();
  const { token } = useToken();
  const { username } = useToken();
  const { userType } = useToken();

  // Function to handle logout
  const handleLogout = async () => {
    // Add your logout logic here
    console.log('Logout clicked');
    // Rest of the code
    try {
      const response = await fetch('http://13.232.227.222:3000/mediproc/major/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }), // Send username in the request body
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      console.log(responseData);
      
      if (responseData.status === 'success') {
        
        alert( responseData.message);
        window.location.href = '/';
  
      } else if (responseData.status==500){
        alert( responseData.message);
        window.location.href = '/';

      }
    } catch (error) {
      console.error('Error:', error);
      alert("Server error");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="username">{username}</span>
      </div>
      <ul className="navbar-right">
      {userType === 'ADMIN' && (
          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users">Users</Link>
          </li>
        )}
        <li className={location.pathname === '/upload' ? 'active' : ''}>
          <Link to="/upload">Upload</Link>
        </li>
        <li className={location.pathname === '/patients' ? 'active' : ''}>
          <Link to="/patients">Patients</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout" className="logout-icon" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
