// OurStrategy.js
import React from 'react';
import styles from './OurStrategy.module.css'; // Import the CSS module
// import companyImage from '../images/logo512.png';
import strategy from '../images/strategy.jpg'

const OurStrategy = () => {
  return (
    <div className={styles.ourStrategyContainer}>
      <div className={styles.textContainer}>
        <h2 className={styles.heading}>Our Strategy</h2>
        <p className={styles.description} style={{marginTop:'30px'}}>
          At Frame Your Memories, our strategy revolves around delivering exceptional experiences that leave a lasting impression. We believe in a customer-centric approach, tailoring our services to meet the unique needs and desires of each client.
        </p>
        <p className={styles.description}>
          Our commitment to innovation drives us to stay ahead of industry trends, ensuring that we bring fresh ideas and creative solutions to every event. Collaboration is at the core of our strategy, working closely with clients and partners to turn visions into reality.
        </p>
      </div>
      <div className={styles.imageContainer}>
        {/* Add your image here */}
        <img src={strategy} alt="Our Strategy" className={styles.ourStrategyImage} />
      </div>
    </div>
  );
};

export default OurStrategy;
