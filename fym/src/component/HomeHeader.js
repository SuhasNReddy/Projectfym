import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Css/HomeHeader.css'

const HomeHeader = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };

    // Attach the event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerStyle = {
    background: isScrolled
      ? 'linear-gradient(to top, rgba(0, 0, 0, 0), #474747,#000)'
      : 'linear-gradient(to bottom,rgba(169, 169, 169,0) ,rgba(0, 0, 0, 0) )',
    transition: 'background 1s ease',
  };

  return (
    <header className="deanheader" style={headerStyle}>
      <div className="deanlogo">
        <Link to="/">Frame Your Memories</Link>
      </div>
      <nav className="deannav">
        <Link to="/">Home</Link>
        <Link to="/customer">Customer</Link>
        <Link to="/business">Business</Link>
        <Link to='/admin'>Admin</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>
    </header>
  );
};

export default HomeHeader;
