// ContactUs.js
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addQuery } from '../actions';
import styles from './ContactUs.module.css';
// import background from '../images/ContactUsBack.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const Contact = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [queryText, setQueryText] = useState('');

  const [isValidated, setIsValidated] = useState(true);

  // ContactUs.js
  const submitQuery = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !subject || !queryText) {
      setIsValidated(false);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValidated(false);
      return;
    }
  
    const query = {
      name,
      email,
      subject,
      queryText,
    };
  
    try {
      // Change the URL to your Express server's endpoint
      const response = await fetch('/api/admin/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });
  
      if (response.ok) {
        console.log('Query submitted successfully');
        // Reset the input fields and validation status after submitting a query
        setName('');
        setEmail('');
        setSubject('');
        setQueryText('');
        setIsValidated(true);
      } else {
        console.error('Failed to submit query');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
    }
  };
  

  return (
  <div className={styles.nav}>
    {/* <div style={{height:'70px',marginTop:'-70px'}} className={styles.nav}></div> */}
    <div className={styles.mainContainer}>
      <div className={styles.contactUsContainer}>
      <div className={styles.leftContainer}>
        <h2>Contact Us</h2>
        <form onSubmit={submitQuery}>
          <div className={styles.formField}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.formField}>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.formField}>
            <label>Subject:</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className={styles.formField}>
            <label>Query:</label>
            <textarea value={queryText} onChange={(e) => setQueryText(e.target.value)}></textarea>
          </div>
          {!isValidated && <p className={styles.errorMsg}>Please fill in all fields and provide a valid email.</p>}
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
      <div className={styles.rightContainer}>
        <h2>Contact Information</h2>
        <div className={styles.deanInfoItem}>
          <p className="deanIcon">&#9742;</p>
          <p>+1 123-456-7890</p>
        </div>
        <div className={styles.deanInfoItem}>
          <p className="deanIcon">&#9993;</p>
          <p>example@gmail.com</p>
        </div>
        <div className={styles.deanInfoItem}>
          <p className="deanIcon"><FontAwesomeIcon icon={faLocationArrow} /></p>
          <p>123 Street, City, Country</p>
        </div>
      </div>
    </div>
    </div>
  </div>
    
  );
};

const mapDispatchToProps =(Dispatch)=> {
  return{
    submitQuery:(data)=>{Dispatch(addQuery(data))}
  }
};

export default connect(null, mapDispatchToProps)(Contact);
