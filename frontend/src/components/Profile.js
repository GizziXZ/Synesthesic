import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:80/posts/${username}`);
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
        const checkFollowStatus = async () => {
            const token = Cookies.get('token');
            if (!token) return;
            try {
                const response = await fetch(`http://localhost:80/following`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setIsFollowing(data.following.includes(username));
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };
        fetchProfile();
        fetchPosts();
        checkFollowStatus();
    }, []);

    if (!profile) {
        return <div></div>;
    }

    const spotifyRegex = /https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?/g;
    let spotifyEmbed = null;

    if (profile.favoriteSong || profile.favoriteSong.match(spotifyRegex)) {
        spotifyEmbed = profile.favoriteSong.replace(
            spotifyRegex,
            `<iframe id="embed-iframe" style="border-radius:12px; margin-bottom: 15px;" src="https://open.spotify.com/embed/track/$1?utm_source=generator" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture;" loading="lazy"></iframe>` 
        );
    }

    const handleLinkClick = (event) => {
        if (event.target.closest(`.${postStyles.heart}`)) {
          event.preventDefault();
        }
    }

    const handleEditClick = () => {
        navigate('/edit-profile');
    }

    const handleFollowClick = async () => {
        const token = Cookies.get('token');
        if (!token) return navigate('/login');
        try {
            const response = await fetch(`http://localhost:80/profile/${username}/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                alert('Error following user:', response.statusText);
                return;
            }

            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    return (
        <div>
            <Header />
            {/* <img src={`data:${profile.image.mimetype};base64,${profile.image.buffer}`} alt={profile.username} className={styles.image} /> */}
            <div className={styles.profile}>
                <div className={styles.profileHeader}>
                <h1 className={styles.username}>{profile.username}</h1>
                {Cookies.get('token') && jwtDecode(Cookies.get('token')).username === profile.username ? (
                    <button className={styles.editButton} onClick={handleEditClick}>Edit</button>
                ) : (
                    isFollowing ? (
                        <button className={styles.followedButton} onClick={handleFollowClick}>Followed</button>
                    ) : (
                        <button className={styles.followButton} onClick={handleFollowClick}>Follow</button>
                    )
                )}
                </div>
                <h3 className={styles.bio}>{profile.bio ? profile.bio.trim() : "No bio exists of this person :("}</h3>
                <div dangerouslySetInnerHTML={{ __html: spotifyEmbed }} />
            </div>
            <hr style={styles.hr}></hr>
            <div className={styles.masonrylayout}>
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