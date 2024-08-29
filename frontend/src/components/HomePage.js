import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
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

  return (
    <div>
      <Header />
      <div className={styles.masonrylayout}>
        {posts.map((post) => {
          const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;
          return (
            <Post
              image={imageUrl}
              title={post.title}
              createdAt={post.createdAt}
              spotifyLink={post.spotifyLink}
              username={post.username}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;