import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <a href="/" className="header__logo" >Synesthesic</a>
      <div className="header__search">
        <input type="text" placeholder="Search" />
      </div>
      <nav className="header__nav">
        <a href="/">Home</a>
        <a href="/following">Following</a>
      </nav>
    </header>
  );
};

export default Header;