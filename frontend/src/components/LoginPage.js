import React, { useState } from 'react';
import styles from './LoginRegister.module.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:80/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token);
        // console.log('User logged in successfully');
        navigate('/');
      } else {
        console.error('Error logging in:', response.status);
        setErrorMessage(await response.text() || response.statusText);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Error logging in. Please try again later.');
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.h2}>Login</h2>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <a href="/register" className={styles.a}>Register here</a>
    </div>
  );
};

export default LoginPage;