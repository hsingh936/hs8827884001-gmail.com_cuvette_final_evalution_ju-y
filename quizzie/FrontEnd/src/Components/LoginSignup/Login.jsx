import React, { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setActivePage, setUserId }) {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null); 

    try {
      const response = await axios.post('https://quizapi-f5wf.onrender.com/auth/login', user);

      console.log('Login successful:', response.data);

      const authToken = response.data.token;
      const userId = response.data.userId;

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', userId);

      setUserId(userId);

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 404) {
        setError('Error 404: User not found');
      } else {
        setError('An error occurred, please try again later');
      }
    } finally {
      setLoading(false); 
    }
  };

  const handleSignupClick = () => {
    navigate('/Signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>QUIZZIE</div>
      <div className={styles.button}>
        <button className={styles.signupbtn1} onClick={handleSignupClick}>Sign Up</button>
        <button className={styles.loginbtn1}> Log In</button>
      </div>
      <div className={styles.details}>
        <div className={styles.inputContainer}>
          <label>
            Email
            <input type='text' name='email' onChange={handleChange} />
          </label>
        </div>

        <div className={styles.inputContainer}>
          <label>
            Password
            <input type='password' name='password' onChange={handleChange} />
          </label>
        </div>
      </div>
      <button className={styles.loginbtn2} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Log In'}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
