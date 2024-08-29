import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isActive, setIsActive] = useState('');
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:80/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const spotifyIframe = document.querySelector('iframe[src*="spotify.com/embed"]');
    if (spotifyIframe) {
      spotifyIframe.addEventListener('load', () => {
        setIsSpotifyLoaded(true);
      });
    }
  }, [post]);

  if (!post) {
    return <div></div>;
  }

  const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;

    const spotifyPattern = /https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)(\?si=[a-zA-Z0-9]+)?/g;

    const spotifyEmbed = post.spotifyLink.replace(
      spotifyPattern,
      // oh my god it actually took me an entire hour to figure out how to do the starting timestamp, i need to add ?utm_source=generator&t=number to the end of the src
      '<iframe id="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/track/$1?utm_source=generator" width="80%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture;" loading="lazy"></iframe>' 
    );

    const handleClick = () => {
        if (isSpotifyLoaded) {
            const spotifyEmbedIframe = document.querySelector('iframe[src*="spotify.com/embed"]');
            const spotifyEmbedWindow = spotifyEmbedIframe.contentWindow;
            spotifyEmbedWindow.postMessage({ command: 'resume' }, '*');
            setIsActive(true);
        }
    };

  return (
    <div>
    <Header />
    <div className={styles.box}>
        <div className={`${styles.container} ${isActive ? styles.active : ''}`} onClick={handleClick}>
        <div className={styles.header}>
            <img className={styles.image} src={imageUrl} alt={post.title} />
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.date}>{new Date(post.createdAt).toLocaleString()}</p>
            <div dangerouslySetInnerHTML={{ __html: spotifyEmbed }} />
            <a className={styles.spotifyLink} href={post.spotifyLink}>Listen on Spotify</a>
            <p className={styles.username}>Posted by {post.username}</p>
        </div>
        </div>
    </div>
    </div>
  );
};

export default PostPage;