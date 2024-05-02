// About.js
import React from 'react';
import Company from './Aboutcomp/Company';
import OurStory from './Aboutcomp/OurStory';
import OurStrategy from './Aboutcomp/OurStrategy';
import OurPeople from './Aboutcomp/OurPeople';
import ByNumbers from './Aboutcomp/ByNumbers';
import styles from '../Css/About.module.css'
import { Link } from 'react-router-dom';

const About = () => { 
  return (
    <div>
      <Link to='/'><span><p className={styles.company} >Frame Your Memories</p></span></Link>
      <div className={styles.nav}></div>
      <div className={styles['about-container']}>
      <Company />
      <hr className={styles.hrLineleft} />
      <OurStory />
      <hr className={styles.hrLineright} />
      <OurStrategy />
      <hr className={styles.hrLinemiddle} />
      <OurPeople />
      <hr className={styles.hrLinemiddle} /> 
      <ByNumbers />
    </div>
    </div>
    
  );
};

export default About;
