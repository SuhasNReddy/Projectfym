import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../Css/Adminlogin.css';
import image1 from '../images/login35.jpg';
import { Link } from 'react-router-dom';
import styles from './Adminlogin.module.css';

const Adminlogin = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();

  const handleLogin = async () => {
    const userIdRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userId.match(userIdRegex)) {
      setErrorMessage('User ID must be alphanumeric.');
      return;
    } else if (!email.match(emailRegex)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    } else if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    try {
      const response = await axios.post('https://projectfym-1.onrender.com/api/admin/login', {
        userId,
        email,
        password
      });

      if (response.data.authenticated) {
        setErrorMessage('');
        history.push({
          pathname: '/admin/Admindashboard',
          state: { userId: userId }  // Passing state
      });
      } else {
        setErrorMessage(response.data.message || 'Incorrect credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Login failed. Please try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.mainc}>
      <div style={{ width: '45%' , position:'relative'}}>
        <Link to='/'><span><p className={styles.company}>Frame Your Memories</p></span></Link>
        <img style={{ height: '100vh', backgroundSize: 'cover', width: '100%' }} src={image1} alt="Logo" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '55%' }}>
        <div className="admin-login-container">
          <div className="admin-login-form">
            <div className="admin-login-header" style={{ textAlign: 'center', marginBottom: '10px' }}><h2 style={{ color: 'brown' }}>Admin Login</h2></div>
            <label className="admin-login-label">User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="admin-login-input"
              autoComplete="new-password"
            />
            <label className="admin-login-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
              autoComplete="new-password"
            />
            <label className="admin-login-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              autoComplete="new-password" 
            />
            {errorMessage && <p className="admin-error-message">{errorMessage}</p>}
            <button onClick={handleLogin} className="admin-login-button" style={{ marginTop: '5px' }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;
