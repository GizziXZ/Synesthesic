import React from 'react';
import styles from './Post.module.css';
import moment from 'moment';

const Post = ({ image, title, username, createdAt }) => {
  return (
    <div className={styles.post}>
      <img src={image} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.username}>{username}</p>
      <p className={styles.createdAt}>{moment(createdAt).calendar()}</p>
    </div>
  );
};

export default Post;