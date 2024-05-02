import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './StatisticsComponent.module.css';

const StatisticsComponent = () => {
  const [statisticsData, setStatisticsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://projectfym-1.onrender.com/api/admin/statistics');
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const jsonData = await response.json();
        setStatisticsData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const renderCustomerBusinessPieChart = () => {
    if (!statisticsData) return null;

    const data = {
      labels: ['Customers', 'Businesses'],
      datasets: [{
        data: [statisticsData.customerCount, statisticsData.businessCount],
        backgroundColor: ['#D8BB27', '#2744D8'],
      }],
    };

    return <Pie data={data} />;
  };

  const renderOrdersProductPieChart = () => {
    if (!statisticsData || !statisticsData.orders) return null;

    const productCount = statisticsData.productCount;
    const orderCount = statisticsData.orders.length;

    const data = {
      labels: ['Products', 'Orders'],
      datasets: [{
        data: [productCount, orderCount],
        backgroundColor: ['#FF0031', '#00FFCE'],
      }],
    };

    return <Pie data={data} />;
  };

  const renderOrdersBarChart = () => {
    if (!statisticsData || !statisticsData.orders) return null;

    const completedOrders = statisticsData.orders.filter(order => order.status === 'completed').length;
    const pendingOrders = statisticsData.orders.length - completedOrders;

    const data = {
      labels: ['Completed', 'Pending'],
      datasets: [{
        label: 'Orders Status',
        data: [completedOrders, pendingOrders],
        backgroundColor: ['#2ecc71', '#e74c3c'],
      }],
    };

    return <Bar data={data} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ textAlign: 'center' }}><h2 style={{color:'#008080'}}>Statistics</h2></div>
      <div style={{display:'flex',flexDirection:'column',gap:'90px',height:'80vh',overflow:'auto'}}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <div style={{ height: '300px', width: '300px' }}>
          <h3 style={{color:'#088F8F'}}>Customer vs Business</h3>
          {renderCustomerBusinessPieChart()}
        </div>
        <div style={{ height: '300px', width: '300px' }}>
          <h3 style={{color:'#088F8F'}}>Orders vs Products</h3>
          {renderOrdersProductPieChart()}
        </div>
      </div>
      <div className={`${styles.chart} ${styles.barChart}`}>
        <h3 style={{color:'#088F8F'}}>Orders Status</h3>
        {renderOrdersBarChart()}
      </div>
      </div>
    </div>
  );
};

export default StatisticsComponent;
