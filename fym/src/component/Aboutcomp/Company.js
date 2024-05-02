// Company.js
import React from 'react';
import styles from './Company.module.css';
// import companyImage from '../images/logo512.png';
import companyImage from '../images/company3.jpg'


const Company = () => {
  return (
    <div className={styles.companyContainer} style={{marginTop:'100px'}}>
      <div className={styles.textContainer}>
        <p className={styles.heading}>Company</p>
        <p className={styles.description}>
          Our company, Frame Your Memories, specializes in organizing events and providing photography and catering services. We offer a seamless platform for users to book events and catering services without the need for direct vendor contact.
        </p>
        {/* Additional Company content goes here */}
      </div>
      <div className={styles.imageContainer}>
        {/* Add your company image here */}
        <img src={companyImage} alt="Company" className={styles.companyImage} />
      </div>
      {/* <hr/> */}
    </div>
  );
};

export default Company;
