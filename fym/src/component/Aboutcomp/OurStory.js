// OurStory.js
import React from 'react';
import styles from './OurStory.module.css'; // Import the CSS module
// import companyImage from '../images/logo512.png';
import ourstory from '../images/ourstory.jpg'

const OurStory = () => {
  return (
    <div className={styles.ourStoryContainer}>
      <div className={styles.imageContainer}>
        {/* Add your image here */}
        <img src={ourstory} alt="Our Story" className={styles.ourStoryImage} />
      </div>
      <div className={styles.textContainer}>
        <p className={styles.heading}>Our Story</p>
        <p className={styles.description} style={{marginTop:'30px'}}>
          In the heart of our journey lies a passion for creating unforgettable moments. Frame Your Memories began with a shared vision among a group of friends who believed in the magic of celebrations and the power of preserving cherished memories.
        </p>
        <p className={styles.description}>
          From our humble beginnings of organizing small gatherings to becoming a trusted name in event planning and photography, our story is woven with the threads of dedication, creativity, and a commitment to making every event extraordinary.
        </p>
      </div>
    </div>
  );
};

export default OurStory;
