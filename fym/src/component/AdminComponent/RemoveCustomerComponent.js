import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RemoveCustomerComponent.module.css';  // Assuming you have some basic styles

const RemoveCustomerComponent = () => {
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/api/admin/allCustomers');
            setCustomers(response.data);
        } catch (error) {
            setErrorMessage('Failed to fetch customers');
        }
    };

    const handleRemoveCustomer = async () => {
        if (!customerId) {
            setErrorMessage("Customer ID is required");
            return;
        }
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.delete(`/api/admin/removeCustomer/${customerId}`);
            if (response.status === 200) {
                setSuccessMessage('Customer removed successfully');
                setCustomers(customers.filter(customer => customer.id !== customerId));
                setCustomerId(''); // Clear selection after removal
            } else {
                setErrorMessage('Failed to remove customer');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error removing customer');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Remove Customer</h2>
            {customers.length > 0 ? (
                <select 
                    value={customerId} 
                    onChange={e => setCustomerId(e.target.value)} 
                    className={styles.input}
                >
                    <option value="">Select a Customer</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.email}
                        </option>
                    ))}
                </select>
            ) : (
                <p>No customers available to remove.</p>
            )}
            <button onClick={handleRemoveCustomer} className={styles.button} disabled={!customerId}>
                Remove Customer
            </button>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>
    );
}

export default RemoveCustomerComponent;
