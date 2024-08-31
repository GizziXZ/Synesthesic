import React from 'react';
import './Header.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import DropdownMenu from './DropdownMenu';

const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const token = Cookies.get('token');

  const handleSearch = (event) => {
    event.preventDefault();
    window.location.href = '/?search=' + encodeURIComponent(searchQuery);
  }

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/';
  }

  return (
    <header className="header">
      <a href="/" className="header__logo" >Synesthesic</a>
      <div className="header__search">
        <form onSubmit={handleSearch}>
        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </form>
      </div>
      <nav className="header__nav">
        {token ? (
          <a className="header__icon">
            <DropdownMenu />
          </a>
        ) : null}
        <a href="/">Home</a>
        {token ? (
          <>
            <a href="/following">Following</a>
            <a href="/create-post">Create</a>
            <a href={'/user/' + jwtDecode(token).username}>{jwtDecode(token).username}</a>
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </nav>
    </header>
  );
};

export default Header;