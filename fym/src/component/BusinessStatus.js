import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BusinessStatus = (props) => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalMoney: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [mostOrderedProduct, setMostOrderedProduct] = useState(null);
  const [productCounts, setProductCounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/business/metric/orders', {
          headers: {
            'Authorization': `Bearer ${props.user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData({
          totalOrders: result.metrics.totalOrders,
          totalMoney: result.metrics.totalMoney,
          pendingOrders: result.metrics.pendingOrders,
          completedOrders: result.metrics.completedOrders
        });
        setMostOrderedProduct(result.mostOrderedProduct);
        setProductCounts(result.productCounts);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [props.user.token]);

  // Data for chart
  const orderData = [
    { name: 'Pending', value: data.pendingOrders },
    { name: 'Completed', value: data.completedOrders }
  ];

  const COLORS = ['#FFBB28', '#00C49F'];

  return (
    <div>
      <h2>Business Status</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ width: 200, height: 200 }}>
            <CircularProgressbar
              value={data.pendingOrders}
              maxValue={data.totalOrders}
              text={`${data.pendingOrders}/${data.totalOrders}`}
              styles={buildStyles({
                pathColor: '#FFBB28',
                textColor: '#f88',
                trailColor: '#d6d6d6',
              })}
            />
            <p>Pending Orders</p>
          </div>
          <ResponsiveContainer width="30%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={orderData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <ul>
            <li>Total Money Earned: ₹ {data.totalMoney}</li>
            {mostOrderedProduct && (
              <li>Most Ordered Product: {mostOrderedProduct.productName} - {mostOrderedProduct.count} times</li>
            )}
            <h3>Product Counts</h3>
            {productCounts.map((product) => (
  product.productName && ( // Check if productName exists and is not empty
    <li key={product.productId}>{product.productName}: Ordered {product.count} times</li>
  )
))}

          </ul>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(BusinessStatus);
