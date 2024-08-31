import React, { useEffect, useState, useNavigate } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Header from './Header';
import Heart from '@react-sandbox/heart';
import moment from 'moment';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isActive, setIsActive] = useState('');
  const [isHearted, setIsHearted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:80/post/${id}`);
        const data = await response.json();
        if (token) {
          setIsHearted(data.likedBy.includes(jwtDecode(token).username));
        }
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
          // hide overlay text
          const overlayText = document.querySelector(`.${styles.overlayText}`);
          if (overlayText) overlayText.style.display = 'none';
          // checking if active first so that clicking anywhere on the page after the initial "clicking to view" won't resume the song by itself
          if (isActive) return;
          setIsActive(true);
          spotifyEmbedWindow.postMessage({ command: 'resume' }, '*');
        }
    };

    const handleHeartClick = async () => {
      try {
        if (!token) {
          return alert('You must be logged in to like a post');
        }
  
        const response = await fetch(`http://localhost:80/post/${id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: isHearted ? JSON.stringify({ like: false }) : JSON.stringify({ like: true }),
        });
  
        if (!response.ok) {
          console.error('Error liking post:', response.statusText);
          return;
        }
  
        setIsHearted(!isHearted);
        setLikeCount(isHearted ? likeCount - 1 : likeCount + 1);
      } catch (error) {
        console.error(error);
      }
    };

    const handleCommentChange = (e) => {
      setNewComment(e.target.value);
    };
  
    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (newComment.trim()) {
        try {
          const response = await fetch(`http://localhost:80/post/${id}/comment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: newComment }),
          });
    
          if (!response.ok) {
            console.error('Error adding comment:', response.statusText);
            return;
          }
    
          const updatedPost = await response.json();
          setPost(updatedPost);
          setNewComment('');
        } catch (error) {
          console.error('Error adding comment:', error);
        }
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
        <p className={styles.likes}>{post.likes}</p>
        <Heart height={24} width={24} inactiveColor='#fff' active={isHearted} onClick={handleHeartClick} className={styles.heart}/>
        <div dangerouslySetInnerHTML={{ __html: spotifyEmbed }} />
        <a className={styles.spotifyLink} href={post.spotifyLink}>Spotify</a>
        <p className={styles.username}>Posted by <a href={`/user/${post.username}`} style={{color: 'gray'}}>{post.username}</a></p>
      </div>
      <div className={styles.commentSection}>
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            className={styles.commentInput}
          />
          <button type="submit" className={styles.commentButton}>Post Comment</button>
          <hr></hr>
        </form>
        <div className={styles.commentsList}>
          {post.comments && post.comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p className={styles.commentUsername}>{comment.username}</p>
              <p>{comment.text}</p>
              <span className={styles.commentDate}>{moment(comment.date).fromNow()}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default PostPage;