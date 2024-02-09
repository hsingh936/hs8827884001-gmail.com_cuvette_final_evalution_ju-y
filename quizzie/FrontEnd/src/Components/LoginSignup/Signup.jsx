import React, { useState, useEffect } from 'react';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

export default function Signup({ setActivePage }) {
  useEffect(() => {
    setActivePage('signup');
  }, [setActivePage]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!(user.name.trim().length > 0)) {
      setNameError('Invalid Name');
      valid = false;
    } else {
      setNameError('');
    }

    if (!(user.email.trim().length > 0)) {
      setEmailError('Invalid Email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!(user.password.trim().length > 0)) {
      setPasswordError('Weak Password');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (user.password !== user.confirmPassword) {
      setConfirmPasswordError("Passwords Don't Match");
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (valid) {
      try {
        
        const response = await axios.post('https://quizzieapi.vercel.app/auth/Signup', user);

        
        console.log('Signup successful:', response.data);

        
        navigate('/login');

        
        setUser({ name: '', email: '', password: '', confirmPassword: '' });
      } catch (error) {
       
        console.error('Error during registration:', error);
        console.log('Axios response:', error.response);
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>QUIZZIE</div>
      <div className={styles.button}>
        <button className={styles.signupbtn1}>Sign Up</button>
        <button className={styles.loginbtn1} onClick={handleLoginClick}> Log In</button>
      </div>
      <div className={`${styles.inputContainer} ${nameError ? styles.error : ''}`}>
        <label>
          Name
          <input
            type='text'
            name='name'
            onChange={handleChange}
            placeholder={nameError}
            className={`${nameError ? styles.error : ''}`}
          />
        </label>
      </div>

      <div className={`${styles.inputContainer} ${emailError ? styles.error : ''}`}>
        <label>
          Email
          <input
            type='text'
            name='email'
            onChange={handleChange}
            placeholder={emailError}
            className={`${emailError ? styles.error : ''}`}
          />
        </label>
      </div>

      <div className={`${styles.inputContainer} ${passwordError ? styles.error : ''}`}>
        <label>
          Password
          <input
            type='password'
            name='password'
            onChange={handleChange}
            placeholder={passwordError}
            className={`${passwordError ? styles.error : ''}`}
          />
        </label>
      </div>

      <div className={`${styles.inputContainer} ${confirmPasswordError ? styles.error : ''}`}>
        <label>
          Confirm Password
          <input
            type='password'
            name='confirmPassword'
            onChange={handleChange}
            placeholder={confirmPasswordError}
            className={`${confirmPasswordError ? styles.error : ''}`}
          />
        </label>
      </div>

      <button className={styles.signupbtn2} onClick={handleSubmit}>
        Sign-Up
      </button>
    </div>
  );
}
