import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Header from './Header';
import Post from './Post';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:80/posts')
//       .then(response => response.json())
//       .then(data => setPosts(data))
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

  return (
    <div>
      <Header />
      <div className="masonry-layout">
        {posts.map(post => (
          <Post
            key={post.id}
            image={post.image}
            title={post.title}
            description={post.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;