import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import styles from './Profile.module.css';
import postStyles from './Post.module.css';
import Post from './Post';
import Header from './Header';

const Profile = () => {
    const username = window.location.pathname.split('/')[2];
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:80/posts/${username}`); // TODO change to fetch the specific user's posts
                const data = await response.json();
                const token = Cookies.get('token');
                if (token) {
                    data.forEach((post) => {
                        post.liked = post.likedBy.includes(jwtDecode(token).username);
                    });
                }
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:80/profile/${username}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
        fetchPosts();
    }, []);

    if (!profile) {
        return <div></div>;
    }

    const handleLinkClick = (event) => {
        if (event.target.closest(`.${postStyles.heart}`)) {
          event.preventDefault();
        }
    }

    return (
        <div className={styles.profile}>
        <Header />
            <h1>{profile.username}</h1>
            <h3>{profile.bio}</h3>
            <div className={styles.posts}>
            {posts.map((post) => {
            const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;
            return (
                <Link to={`/post/${post.id}`} key={post.id} className={styles.masonryItem} onClick={handleLinkClick}>
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
            </div>
        </div>
    )
}

export default Profile;