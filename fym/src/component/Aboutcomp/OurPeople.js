// OurPeople.js
import React from 'react';
import styles from './OurPeople.module.css';
import companyImage from '../images/company3.jpg';

const OurPeople = () => {
  const peopleData = [
    { id: 1, name: 'Suhas', position: 'CEO', image: 'john-doe.jpg', linkedin: 'john-doe-linkedin' },
    { id: 2, name: 'Devi', position: 'Creative Director', image: 'jane-smith.jpg', linkedin: 'jane-smith-linkedin' },
    { id: 3, name: 'Tejeswar', position: 'Event Planner', image: 'mike-johnson.jpg', linkedin: 'mike-johnson-linkedin' },
    { id: 4, name: 'Praghna', position: 'Photographer', image: 'emily-white.jpg', linkedin: 'emily-white-linkedin' },
    { id: 5, name: 'Tejas', position: 'Catering Manager', image: 'chris-brown.jpg', linkedin: 'chris-brown-linkedin' },
  ];

  return (
    <div className={styles.section} style={{marginBottom:'50px'}}>
      <p className={styles.heading} style={{marginTop:'50px'}}>Meet Our People</p>
      <div className={styles.ourPeople} style={{marginTop:'50px'}}>
        {peopleData.map((person, index) => (
          <a key={person.id} href={`https://www.linkedin.com/in/${person.linkedin}`} className={styles.card} style={{ gridColumn: index < 3 ? 'span 1' : 'span 2' ,textDecoration:'none'}}>
            <img src={companyImage} alt={person.name} className={styles.image} />
            <div className={styles.details}>
              <h3 style={{color:'#008080'}}>{person.name}</h3>
              <p>{person.position}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default OurPeople;
