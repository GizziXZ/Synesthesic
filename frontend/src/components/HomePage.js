import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import postStyles from './Post.module.css';
import Header from './Header';
import Post from './Post';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:80/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleLinkClick = (event) => {
    if (event.target.closest(`.${postStyles.heart}`)) {
      event.preventDefault();
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.masonrylayout}>
        {posts.map((post) => {
          const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;
          return (
            <Link to={`/post/${post.id}`} key={post.id} className={styles.masonryItem} onClick={handleLinkClick}>
              <Post
                image={imageUrl}
                title={post.title}
                createdAt={post.createdAt}
                spotifyLink={post.spotifyLink}
                username={post.username}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;