import React from 'react';
import styles from './Post.module.css';
import moment from 'moment';
import Heart from '@react-sandbox/heart';
import Cookies from 'js-cookie';

const Post = ({ id, image, title, username, createdAt, likes, liked }) => {
  const [isHearted, setIsHearted] = React.useState(liked);
  const [likeCount, setLikeCount] = React.useState(likes);
  const token = Cookies.get('token');
  const handleHeartClick = async () => {
    try {
      if (!token) {
        return alert('You must be logged in to like a post');
      }

      const response = await fetch(`http://localhost:80/posts/${id}/like`, {
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
  
  return (
    <div className={styles.post}>
      <img src={image} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.username}>{username}</p>
      <p className={styles.createdAt}>{moment(createdAt).calendar()}</p>
      <p className={styles.likes}>{likeCount}</p>
      <Heart height={24} width={24} inactiveColor='#fff' active={isHearted} onClick={handleHeartClick} className={styles.heart}/>
    </div>
  );
};

export default Post;