import React, { useState } from 'react';
import Header from './Header';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ title, spotifyLink, image });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <Header />
      <div className={styles.createPostContainer}>
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit} className={styles.createPostForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="spotifyLink">Spotify Link</label>
            <input
              type="url"
              id="spotifyLink"
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Create Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;