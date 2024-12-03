import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    if (media.length > 0) {
      media.forEach(file => {
        formData.append('media', file);
      });
    }

    try {
      await axios.post('http://localhost:5000/api/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Reset form
      setTitle('');
      setContent('');
      setCoverImage(null);
      setMedia([]);
      // Redirect or show success message
    } catch (err) {
      console.error(err);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(prevMedia => [...prevMedia, ...files]);
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <div>
          <label>Cover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        <div>
          <label>Media Files:</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
          />
        </div>
        
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['image', 'video']
            ]
          }}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      <div className="media-preview">
        {media.map((file, index) => (
          <div key={index} className="media-item">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
            ) : (
              <video src={URL.createObjectURL(file)} controls />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateBlog;