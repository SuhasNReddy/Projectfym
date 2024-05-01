// Footer.js

import React from 'react';
import '../Css/HomeFooter.css';
import footerlogo from '../images/footerlogo.png';
import emailIcon from '../images/email.png';
import { Link } from 'react-router-dom';

const HomeFooter = () => {
  return (
    <>
    <div className="Homefooter">
      <div className="Homefooterrow">
        <div className="Homefootercol">
          <img src={footerlogo} className="Homefooterlogo" alt="Footer Logo" />
          <p>-Give Your Guest A Reason To Stay</p>
        </div>
        <div className="Homefootercol">
          <h2>Information</h2><br />
          <a href="#"><b>FAQs</b></a><br />
          <a href="#"><b>Careers</b></a><br />
          <a href="#"><b>Security</b></a>
        </div>
        <div className="Homefootercol">
          <h2>Connect with Us</h2><br />
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="Homefootercol">
          <h2>Company</h2><br />
          <a href="#"><b>Our Story</b></a><br />
          <a href="#"><b>Terms and Conditions</b></a><br />
          <a href="#"><b>Become a Wholesaler</b></a><br />
          <a href="#"><b>Privacy Policy</b></a><br />
        </div>
      </div>
    </div>
    <div style={{backgroundColor:'#333',textAlign:'center',color:'white'}}>
    <hr />
    <p style={{marginTop:'20px'}}>&copy; {new Date().getFullYear()} Frame Your Memories</p>
    </div>
    </>
  ); 
};

export default HomeFooter;
