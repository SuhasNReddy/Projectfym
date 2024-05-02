import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddAdminComponent.module.css'; // Import the CSS module

const AddAdminComponent = () => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');  // Added success message state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddAdmin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');  // Clear previous success message

        // Regular expressions for validation
        const userIdRegex = /^[a-zA-Z0-9]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Basic validation
        if (!userId.match(userIdRegex)) {
            setErrorMessage('User ID must be alphanumeric.');
            setIsSubmitting(false);
            return;
        } else if (!email.match(emailRegex)) {
            setErrorMessage('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        } else if (!password) {
            setErrorMessage('Please enter a password.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('https://projectfym-1.onrender.com/api/admin/add', {
                userId, email, password
            });

            if (response.status === 201) {
                setSuccessMessage('Admin added successfully!');
                setUserId('');
                setEmail('');
                setPassword('');
            } else {
                setErrorMessage('Failed to add admin');
            }
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Error while adding admin');
            console.error('Adding admin failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className={styles.form}>
                <label className={styles.label}>
                    User ID:
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
                <button type="submit" disabled={isSubmitting} className={styles.button}>
                    {isSubmitting ? 'Adding...' : 'Add Admin'}
                </button>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}  
            </form>
        </div>
    );
}

export default AddAdminComponent;
