import React, { useState } from 'react';
import styles from './LoginRegister.module.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:80/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('User registered successfully');
        navigate('/login');
      } else {
        console.error('Error registering user:', response.status);
        setErrorMessage(await response.text() || response.statusText);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.h2}>Register</h2>
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
        <button type="submit" className={styles.button}>Register</button>
      </form>
      <a href="/login" className={styles.a}>Login here</a>
    </div>
  );
};

export default RegisterPage;