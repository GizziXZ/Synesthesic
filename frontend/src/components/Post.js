import React from 'react';
import styles from './Post.module.css';

const Post = ({ image, title, description }) => {
  return (
    <div className={styles.post}>
      <img src={image} alt={title} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Post;