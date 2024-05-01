// ByNumbers.js
import React, { useState, useEffect, useRef } from 'react';
import styles from './ByNumbers.module.css'; // Import the CSS module

const ByNumbers = () => {
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [categories, setCategories] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [countriesExpanded, setCountriesExpanded] = useState(0);

  // Create a ref to the component
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Start incrementing when the component is visible
          const interval = setInterval(() => {
            setTotalSubscribers((prev) => (prev < 500 ? prev + 1 : 500));
            setCategories((prev) => (prev < 100 ? prev + 1 : 100));
            setBookings((prev) => (prev < 250 ? prev + 1 : 250));
            setCountriesExpanded((prev) => (prev < 10 ? prev + 1 : 10));
          }, 5); // Adjust the interval duration as needed

          // Clear the interval and disconnect the observer when the component is unmounted
          return () => {
            clearInterval(interval);
            observer.disconnect();
          };
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is visible
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    // Disconnect the observer when the component is unmounted
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={componentRef}>
      <p className={styles.heading} style={{ marginTop: '50px' }}>
        Achievements
      </p>
      <div className={styles.byNumbers}>
        {/* First Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.numbersContainer}>
            <div className={styles.bigNumbers}>{totalSubscribers}+</div>
            <p>Total Subscribers</p>
          </div>
          <div className={styles.numbersContainer}>
            <div className={styles.bigNumbers}>{categories}+</div>
            <p>Categories</p>
          </div>
        </div>

        {/* Second Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.numbersContainer}>
            <div className={styles.bigNumbers}>{bookings}+</div>
            <p>Bookings</p>
          </div>
          <div className={styles.numbersContainer}>
            <div className={styles.bigNumbers}>{countriesExpanded}+</div>
            <p>Countries Expanded</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByNumbers;
