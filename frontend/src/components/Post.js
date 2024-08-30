import React from 'react';
import styles from './Post.module.css';
import moment from 'moment';
import Heart from '@react-sandbox/heart';

const Post = ({ image, title, username, createdAt }) => {
  const [isHearted, setIsHearted] = React.useState(false);
  const handleHeartClick = (event) => {
    // handle logic for liking a post
    console.log('Heart clicked');
    setIsHearted(!isHearted);
  };
  
  return (
    <div className={styles.post}>
      <img src={image} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.username}>{username}</p>
      <p className={styles.createdAt}>{moment(createdAt).calendar()}</p>
      <Heart height={24} width={24} inactiveColor='#fff' active={isHearted} onClick={handleHeartClick} className={styles.heart}/>
    </div>
  );
};

export default Post;