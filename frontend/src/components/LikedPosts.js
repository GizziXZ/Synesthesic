import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Post from './Post';
import postStyles from './Post.module.css';
import Masonry from 'react-masonry-css';
import Header from './Header';
import styles from './LikedPosts.module.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const LikedPosts = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');
    
    useEffect(() => {
        const fetchLikedPosts = async () => {
        try {
            if (!token) navigate('/login');
            const response = await fetch('http://localhost:80/liked-posts', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            const data = await response.json();
            data.forEach((post) => {
                post.liked = post.likedBy.includes(jwtDecode(token).username);
            });
            setPosts(data);
        } catch (error) {
            console.error('Error fetching liked posts:', error);
        }
        };
        fetchLikedPosts();
    }, []);
    
    const handleLinkClick = (event) => {
        if (event.target.closest(`.${postStyles.heart}`)) {
          event.preventDefault();
        }
    }

    const breakpointColumnsObj = {
        default: 6,
        1100: 2,
        700: 1
    };

    return (
        <>
        <Header />
        <h1>Liked Posts</h1>
        <hr></hr>
        <Masonry breakpointCols={breakpointColumnsObj} className={styles.masonryGrid} columnClassName={styles.masonryGridColumn}>
        {posts.map(post => {
            const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;
            console.log(post)
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
        })}
        </Masonry>
        {/* {!hasMore && <p className={styles.endMessage}>-- that's all, folks --</p>} */}
        </>
    );
}

export default LikedPosts;