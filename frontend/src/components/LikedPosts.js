import React from 'react';
import Header from './Header';
import styles from './LikedPosts.module.css';
import Cookies from 'js-cookie';

const LikedPosts = () => {
    const [posts, setPosts] = React.useState([]);
    
    React.useEffect(() => {
        const fetchLikedPosts = async () => {
        try {
            const response = await fetch('http://localhost:80/liked-posts', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching liked posts:', error);
        }
        };
        fetchLikedPosts();
    }, []);
    
    return (
        <>
        <Header />
        <div className={styles.container}>
        <h1>Liked Posts</h1>
        {posts.map(post => (
            <div key={post.id} className={styles.post}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
            </div>
        ))}
        </div>
        </>
    );
}

export default LikedPosts;