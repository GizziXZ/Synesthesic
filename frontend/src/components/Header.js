import React from 'react';
import './Header.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const token = Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/';
  }

  return (
    <header className="header">
      <a href="/" className="header__logo" >Synesthesic</a>
      <div className="header__search">
        <input type="text" placeholder="Search" />
      </div>
      <nav className="header__nav">
        <a href="/">Home</a>
        <a href="/following">Following</a>
        {token ? (
          <>
            <a href="/create-post">Create</a>
            <a>{jwtDecode(token).username}</a>
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
        {/* <a href='/login'>Login</a> */}
      </nav>
    </header>
  );
};

export default Header;