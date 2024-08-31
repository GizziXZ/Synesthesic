import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import postStyles from './Post.module.css';
import Masonry from 'react-masonry-css'
import Header from './Header';
import Post from './Post';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search') || '';
        let response;
        if (!search) response = await fetch(`http://localhost:80/posts?page=${page}&limit=10`);
        else response = await fetch(`http://localhost:80/search?page=${page}&limit=10&q=${encodeURIComponent(search)}`);
        const data = await response.json();
        const token = Cookies.get('token');
        if (token) {
          data.posts.forEach((post) => {
            post.liked = post.likedBy.includes(jwtDecode(token).username);
          });
        }
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [page]);

  const handleLinkClick = (event) => {
    if (event.target.closest(`.${postStyles.heart}`)) {
      event.preventDefault();
    }
  }

  const lastPostElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  const breakpointColumnsObj = {
    default: 6,
    1100: 2,
    700: 1
  };

  return (
    <div>
      <Header />
      <Masonry breakpointCols={breakpointColumnsObj} className={styles.masonryGrid} columnClassName={styles.masonryGridColumn}>
        {posts.map((post, index) => {
          const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;
          if (posts.length === index + 1) {
            return (
              <Link to={`/post/${post.id}`} className={styles.masonryItem} onClick={handleLinkClick} ref={lastPostElementRef}>
                <Post
                  id={post.id}
                  image={imageUrl}
                  title={post.title}
                  createdAt={post.createdAt}
                  spotifyLink={post.spotifyLink}
                  username={post.username}
                  likes={post.likes}
                  liked={post.liked}
                />
              </Link>
            );
          } else {
            return (
              <Link to={`/post/${post.id}`} className={styles.masonryItem} onClick={handleLinkClick}>
                <Post
                  id={post.id}
                  image={imageUrl}
                  title={post.title}
                  createdAt={post.createdAt}
                  spotifyLink={post.spotifyLink}
                  username={post.username}
                  likes={post.likes}
                  liked={post.liked}
                />
              </Link>
            );
          }
        })}
        </Masonry>
        {!hasMore && <p className={styles.endMessage}>-- that's all, folks --</p>}
    </div>
  );
};

export default HomePage;