import React from 'react';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom/cjs/react-router-dom';
const Header = (props) => {
  
  const handleClick=()=>{
    props.logout();
    localStorage.removeItem('user');
  }
  return (
    <header className="header">
      <div className="logo">
        <img src="your-logo.png" alt="Website Logo" />
      </div>
      <nav className="nav-links">
        {/* <a href="#addservice">Service</a> */}
        <NavLink to='/business/service'>Service</NavLink>
        
        <NavLink to="/business/location">Locations</NavLink>
        <NavLink to="/business/orders">Orders</NavLink>
        <button onClick={handleClick} >LogOut</button>
      </nav>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispathToProps = (Dispatch) => {
  return {
    logout: () => {
      Dispatch({ type: 'LOG_OUT' });
    }
  };
};

export default connect(mapStateToProps,mapDispathToProps)(Header);
