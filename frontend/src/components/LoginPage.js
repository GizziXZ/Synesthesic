import React, { useState } from 'react';
import styles from './LoginRegister.module.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login logic here
    console.log('Logging in with', username, password);
    onLogin();
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.h2}>Login</h2>
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