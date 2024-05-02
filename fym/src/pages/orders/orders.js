import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './CustomerOrders.css'; // Adjust the path accordingly

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' by default

  const userToken = useSelector((state) => state.customerUser ? state.customerUser.token : null);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        if (!userToken) {
          throw new Error('Not authorized. Please log in.');
        }

        const response = await fetch('https://projectfym-1.onrender.com/api/customer/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await response.json();
        setOrders(ordersData);
        setError(null);
      } catch (error) {
        console.error('Error fetching customer orders:', error.message);
        setOrders([]);
        setError(error.message);
      }
    };

    fetchCustomerOrders();
  }, [userToken, statusFilter]);

  const handleFilterChange = (newStatusFilter) => {
    setStatusFilter(newStatusFilter);
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((order) => order.status.toLowerCase() === statusFilter);

  return (
    <div className="customer-orders-container">
      <h2 style={{ textAlign: "center" }}>My Orders</h2>
      <div className="order-filter">
        <label>Status Filter:</label>
        <select value={statusFilter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      {filteredOrders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-details">
            <p><strong>Order ID</strong> : {order._id}</p>
            <p><strong>Product Name</strong> : {order.productName}</p>
            <p><strong>Total Amount</strong> : {order.totalAmount}</p>
            <p><strong>Date</strong> : {order.startDate} to {order.endDate}</p>
            {/* <p><strong>Phone Number:</strong> {order.phoneNumber}</p> */}
            <p><strong>Product ID</strong> : {order.pid}</p>
            <p><strong>Status</strong> : {order.status}</p>
          </div>
          {/* Add more details */}
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
