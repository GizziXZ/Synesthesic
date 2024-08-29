import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

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

  const imageUrl = `data:${post.image.mimetype};base64,${post.image.buffer}`;

  return (
    <div>
      <Header />
      <div>
        <img src={imageUrl} alt={post.title} />
        <h1>{post.title}</h1>
        <p>{post.createdAt}</p>
        <a href={post.spotifyLink}>Listen on Spotify</a>
        <p>Posted by {post.username}</p>
      </div>
    </div>
  );
};

export default PostPage;