import React, { useState } from 'react';
import styles from './LoginRegister.module.css';

const RegisterPage = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        onRegister();
      } else {
        console.error('Error registering user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.h2}>Register</h2>
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