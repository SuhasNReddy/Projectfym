import React, { useState } from "react";
import './CustomerLoginSignup.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useDispatch } from "react-redux";
import user_icon from '../../Assets/person.png';
import email_icon from '../../Assets/email.png';
import password_icon from '../../Assets/password.png';
import { Link } from 'react-router-dom';
import image from '../../images/login23.jpg';

const WelcomeModal = ({ userName, closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Welcome, {userName} </p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

const CustomerLoginSignup = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = async () => {
    // Reset error messages
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setError('');

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Perform validation
    if (action === "Sign Up") {
      if (!name) {
        setNameError('Name is required');
      }
    }

    if (!email) {
      setEmailError('Email is required');
    }

    if (email) {
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email format");
      }
    }

    if (!password) {
      setPasswordError('Password is required');
    }
    if (password) {
      if (password.length < 8) {
        setPasswordError('Minimum length (i.e., 8) required');
      }
    }

    // Handle Sign Up or Login based on the action
    if (action === 'Sign Up' && name && email && password) {
      try {
        const response = await fetch('/api/customer/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setError(data.error || 'Sign-up failed');
          } else {
            const errorMessage = await response.text();
            setError(errorMessage || 'Sign-up failed. Server returned an error');
          }
        } else {
          const data = await response.json();
          console.log('User signed up successfully:', data);
          const userName = data.email;
          setShowModal(true);

          // Dispatch the customerUser to Redux store
          localStorage.setItem('customerUser', JSON.stringify(data));
          console.log(data.token,"inside customer login")
          dispatch({ type: "CUSTOMER_LOGIN", customerUser: data });
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setError('Error signing up. Please try again.');
      }
    } else if (action === 'Login' && email && password) {
      try {
        const response = await fetch('/api/customer/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Sign-in successful, navigate to the shop
          localStorage.setItem('customerUser',JSON.stringify(data));
          dispatch({ type: "CUSTOMER_LOGIN", customerUser: data });
          console.log(data,"inside customer login")
          history.push('/customer/shop');

          
        } else {
          setError(data.error || 'Sign-in failed');
        }
      } catch (error) {
        console.error('Error signing in:', error);
        setError('Error signing in. Please try again.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    history.push('/customer/shop');
  };

  return (
    <div style={{display:'flex',flexDirection:'row'}}>
    <div style={{ width: '35%' , position:'relative'}}>
    <Link to='/'><span><p className='company' >Frame Your Memories</p></span></Link>
    <img style={{ height: '100vh', backgroundSize: 'cover', width: '100%' }} src={image} alt="Logo" />
    </div>
    <div style={{width:'65%'}} className='container-praghna'>
      <div className="header">
        <div className="text" style={{textAlign:'center',marginLeft:'90px'}}>{action}</div>
        {/* <div className="underline"></div> */}
      </div> 

      <div className='inputs'>
        {action === "Login" ? <div></div> : <div className="input">
          <img src={user_icon} alt='' />
          <input type='text' placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="error">{nameError}</div> 
        </div>}

        <div className="input">
          <img src={email_icon} alt='' />
          <input type='email' placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="error">{emailError}</div>
        </div>
        <div className="input">
          <img src={password_icon} alt='' />
          <input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="error">{passwordError}</div>
        </div>
      </div >
      {action === "Sign Up" ? <div></div> : <div className="forgot-password" style={{textAlign:'center',marginLeft:'-65px'}}>Lost Password? <span>Click Here!</span></div>}

      <div className="submit-containerc">
        <div className={action === "Login" ? "submitc gray" : "submitc"} onClick={() => {
          setAction("Sign Up");
          handleFormSubmit();
        }}>Sign Up</div>
        <div className={action === "Sign Up" ? "submitc gray" : "submitc"} onClick={() => {
          setAction("Login");
          handleFormSubmit();
        }}>Login</div>
      </div>

      {error && <div className="error">{error}</div>}

      {showModal && <WelcomeModal userName={name} closeModal={closeModal} />}
    </div>
    </div>
    
  );
}

export { CustomerLoginSignup };
