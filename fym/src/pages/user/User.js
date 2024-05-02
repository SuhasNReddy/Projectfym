// User.js (React component)
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './User.css';

// Placeholder for action
const updatePassword = async (passwordData, authToken) => {
  try {
    if (!authToken) {
      throw new Error('Unauthorized: No token available');
    }

    // Placeholder for API call to update password on the backend
    // Replace this with your actual API call
    const response = await fetch('https://projectfym-1.onrender.com/api/customer/updatePassword', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Error updating password: ' + error.message);
  }
};

const User = () => {
  const userDetails = useSelector((state) => state.customerUser || {});
  const authToken = userDetails.token; // Access the token directly from customerUser

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const handlePasswordChange = async () => {
    try {
      // Frontend validations
      const newErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };

      if (!passwordData.oldPassword) {
        newErrors.oldPassword = 'Old Password is required';
      }

      if (!passwordData.newPassword) {
        newErrors.newPassword = 'New Password is required';
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'New Password should be at least 6 characters';
      }

      if (!passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm Password is required';
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (newErrors.oldPassword || newErrors.newPassword || newErrors.confirmPassword) {
        // If there are errors, update the state and return
        setErrors(newErrors);
        setErrorMessage(''); // Clear any existing error message
        setSuccessMessage(''); // Clear any existing success message
        return;
      }

      // No errors, proceed with password change logic
      await updatePassword(passwordData, authToken); // Pass the token to the updatePassword function
      console.log('Password changed successfully');
      setErrorMessage(''); // Clear any existing error message
      setSuccessMessage('Password changed successfully'); // Set success message
    } catch (error) {
      console.error('Error changing password:', error.message);
      setErrorMessage(error.message);
      setSuccessMessage(''); // Clear success message on error
    }
  };

  return (
    <div className="user-container">
      <h2>User Details</h2>
      <div className="user-details">
        <p>
          <strong>Email: <span>{userDetails.email}</span> </strong>
        </p>
      </div>
      <div className="change-password">
        <h2>Change Password</h2>
        <div className="password-form">
          <div className="input-group">
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            />
            {errors.oldPassword && <div className="error">{errors.oldPassword}</div>}
          </div>
          <div className="input-group">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            {errors.newPassword && <div className="error">{errors.newPassword}</div>}
          </div>
          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
          </div>
          <button onClick={handlePasswordChange}>Change Password</button>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>} {/* Display success message */}
        </div>
      </div>
    </div>
  );
};

export default User;
