// Admindashboard.js

import React, { useState,useEffect } from 'react';
import styles from './Admindashboard.module.css';
import ContactUs from './ContactUs';
import QueriesDisplay from './AdminComponent/QueriesDisplay';
import { Provider } from 'react-redux';
import store from '../store';
import Dashboard from './AdminComponent/Dashboard';
import PartnersComponent from './AdminComponent/PartnersComponent';
import CustomersComponent from './AdminComponent/CustomerComponent';
import BookingsComponent from './AdminComponent/BookingsComponent';
import ProductsComponent from './AdminComponent/ProductsComponent';
import StatisticsComponent from './AdminComponent/StatisticsComponent';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import AddAdminComponent from './AdminComponent/AddAdminComponent';
import RemoveCustomerComponent from './AdminComponent/RemoveCustomerComponent';

function Admindashboard() {
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState('Statistics');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
    }
  }, [location]);

  const handleNavClick = (section) => {
    setSelectedSection(section);
  };

  const handleLogout = () => {
    // Perform any logout logic here, e.g., redirecting to '/admin'
    window.location.href = '/admin';
  };

  return (
    <Provider store={store}>
      <div className={styles.appcontainer}>
        
        <div className={styles.navbar} style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          
          <div><div className={styles.navsections}>
          <div className={styles.companyname}><Link to="/" className={styles.companyname}>FYM</Link></div>
            <div
              className={`${styles.navitem} ${selectedSection === 'Statistics' ? styles.active : ''}`}
              onClick={() => handleNavClick('Statistics')}
            >
              Statistics
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'Partners' ? styles.active : ''}`}
              onClick={() => handleNavClick('Partners')}
            >
              Partners
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'Customers' ? styles.active : ''}`}
              onClick={() => handleNavClick('Customers')}
            >
              Customers
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'Products' ? styles.active : ''}`}
              onClick={() => handleNavClick('Products')}
            >
              Products
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'Bookings' ? styles.active : ''}`}
              onClick={() => handleNavClick('Bookings')}
            >
              Bookings
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'Queries' ? styles.active : ''}`}
              onClick={() => handleNavClick('Queries')}
            >
              Queries
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'newAdmin' ? styles.active : ''}`}
              onClick={() => handleNavClick('newAdmin')}
            >
              Add Admin
            </div>
            <div
              className={`${styles.navitem} ${selectedSection === 'removeCustomer' ? styles.active : ''}`}
              onClick={() => handleNavClick('removeCustomer')}
            >
              Delete Customer
            </div>
          </div></div>
          <div><div className={`${styles.navitem} ${styles.logoutButton}`} onClick={handleLogout}>
              Logout
            </div></div>
        </div>
        <div className={styles.maincontainer}>
        <div className={` ${styles.userId}`}>Hi, {userId}! <FaUserCircle size={25}/></div>
          {selectedSection === 'Partners' && <PartnersComponent />}
          {selectedSection === 'Customers' && <CustomersComponent />}
          {selectedSection === 'Bookings' && <BookingsComponent />}
          {selectedSection === 'Products' && < ProductsComponent/>}
          {selectedSection === 'Statistics' && <StatisticsComponent />}
          {selectedSection === 'Queries' && <QueriesDisplay />}
          {selectedSection === 'newAdmin' && <AddAdminComponent/>}
          {selectedSection === 'removeCustomer' && <RemoveCustomerComponent/>}

        </div>
      </div>
    </Provider>
  );
}

export default Admindashboard;
