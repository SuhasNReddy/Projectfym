// Checkout.js

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './check_ch.css';

const Checkout = (props) => {
  const userToken = useSelector((state) => state.customerUser.token);
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    startDate: '',
    endDate: '',
    totalAmount: props.totalAmountCustomer,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!userToken) {
        throw new Error('Not authorized. Please log in.');
      }

      const response = await fetch('/api/customer/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSuccessMessage('Form submitted successfully');
      setErrorMessage('');
      history.push('/customer/orders');
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <div className='bodyofcheckout'>
      <div className="checkout-form-ch">
        <h2 className="form-title-ch">Checkout</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group-ch">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group-ch">
            <label htmlFor="card-number">Card Number:</label>
            <input
              type="text"
              id="card-number"
              name="cardNumber"
              pattern="\d{16}"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group-ch">
            <label htmlFor="expiry-date">Expiry Date:</label>
            <input
              type="date"
              id="expiry-date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group-ch">
            <label htmlFor="cvv">CVV:</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              pattern="\d{3}"
              value={formData.cvv}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group-ch">
            <label htmlFor="start-date">Start Date:</label>
            <input
              type="date"
              id="start-date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group-ch">
            <label htmlFor="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group-ch">
            <label htmlFor="total-amount">Total Amount:</label>
            <p>{`${props.totalAmountCustomer}`}</p>
          </div>
          <div className="input-group-ch">
            <button type="submit" className="submit-btn-ch">
              Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
