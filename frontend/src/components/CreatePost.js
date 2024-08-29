import React, { useState } from 'react';
import Header from './Header';
import styles from './CreatePost.module.css';
import Cookies from 'js-cookie';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      alert('You must be logged in to create a post.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('spotifyLink', spotifyLink);
    formData.append('image', image);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:80/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Post created successfully!');
        // NOTE - afterwards we want to redirect to the post page, but for now we'll just clear the form
        setTitle('');
        setSpotifyLink('');
        setImage(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the post.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <Header />
      <div className={styles.createPostContainer}>
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit} className={styles.createPostForm} encType='multipart/form-data'>
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
          {/* <button type="submit" className={styles.submitButton}>Create Post</button> */}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;