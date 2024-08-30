import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Following from './components/Following';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const isTokenValid = () => {
    const token = Cookies.get('token');
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  }

  useEffect(() => {
    if (isTokenValid()) {
      setIsLoggedIn(true);
    } else {
      Cookies.remove('token');
      setIsLoggedIn(false);
    }
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/following" element={<Following />} />
      </Routes>
    </Router>
  );
}

export default App;