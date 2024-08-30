import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import moment from 'moment';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isActive, setIsActive] = useState('');
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:80/post/${id}`);
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
      `<iframe id="embed-iframe" style="border-radius:12px; margin-top: -10px;" src="https://open.spotify.com/embed/track/$1?utm_source=generator&t=${post.timestamp}" width="80%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture;" loading="lazy"></iframe>` 
    );

    const handleClick = () => {
        if (isSpotifyLoaded) {
          const spotifyEmbedIframe = document.querySelector('iframe[src*="spotify.com/embed"]');
          const spotifyEmbedWindow = spotifyEmbedIframe.contentWindow;
          spotifyEmbedWindow.postMessage({ command: 'resume' }, '*');
          setIsActive(true);

          // hide overlay text
          const overlayText = document.querySelector(`.${styles.overlayText}`);
          if (overlayText) overlayText.style.display = 'none';
        }
    };

  return (
    <div>
    <Header />
    <div className={styles.box}>
      <div className={styles.overlayText} onClick={handleClick}>Click to view</div>
      <div className={`${styles.container} ${isActive ? styles.active : ''}`} onClick={handleClick}>
      <div className={styles.header}>
        <p className={styles.date}>{moment(post.createdAt).calendar()}</p>
        <img className={styles.image} src={imageUrl} alt={post.title} />
        <h1 className={styles.title}>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: spotifyEmbed }} />
        <a className={styles.spotifyLink} href={post.spotifyLink}>Spotify</a>
        <p className={styles.username}>Posted by <a href={`/user/${post.username}`} style={{color: 'gray'}}>{post.username}</a></p>
      </div>
      </div>
    </div>
    </div>
  );
};

export default PostPage;