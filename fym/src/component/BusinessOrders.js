  import { useState, useEffect } from "react";
  import css from "../Css/BusinessOrders.module.css";
  import { connect } from "react-redux";

  const BusinessOrders = (props) => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await fetch('https://projectfym-1.onrender.com/api/businessorders_get', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${props.user.token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setOrders(data.orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError(error.message);
        }
      };

      fetchOrders();
    }, [props.user]);

    const handleClick = async (id) => {
      console.log(id,"hanwjhwvh");
      try {
        const response = await fetch(`https://projectfym-1.onrender.com/api/businessorders_updatestatus/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${props.user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update the local state after successful status update
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: 'completed' } : order
          )
        );
      } catch (error) {
        console.error('Error updating order status:', error);
        setError(error.message);
      }
    };

    const filterOrders = (order) => {
      if (filter === 'all') {
        return true;
      } else {
        return order.status === filter;
      }
    };
    
    return (
      <div className={css["business-orders-container"]}>
        <p className={css["business-orders-title"]}>Business Orders</p>
        <div className={css["filter-buttons"]}>
          {/* Convert the "Pending" button to a dropdown */}
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className={css["business-orders-list"]}>
          {orders.filter(filterOrders).map((order) => (
            <div key={order._id} className={css["business-order-item"]}>
              <h3>
                <strong style={{ color: 'rgb(119,119,119)' }}>Product:</strong> {order.productName}
              </h3>
              <p>Date: {order.startDate} to {order.endDate}</p>
              <p>Customer Name: {order.name}</p>
              <p style={{ fontSize: '15px', color: "rgb(119,119,119)" }}>
                <strong>Status:</strong> {order.status}
              </p>
              {order.status === "pending" && (
                <button onClick={() => handleClick(order._id)}>Complete</button>
              )}
            </div>
          ))}
        </div>
        {error && <p>{error}</p>}
      </div>
    );
  };

  const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

  export default connect(mapStateToProps)(BusinessOrders);
