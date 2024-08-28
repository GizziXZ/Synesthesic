import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Header from './Header';

const HomePage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:80/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
        <Header />
        <p>{message}</p>
    </div>
  );
};

export default HomePage;