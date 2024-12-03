import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }], // Thêm tùy chọn căn chỉnh văn bản
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []); 

  async function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const imageUrl = response.data.url;
        
        const quill = this.quill;
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('Error uploading image');
      }
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/blog`, {
        title,
        content
      });
      
      setMessage('Blog posted successfully!');
      setTitle('');
      setContent('');
      console.log('Blog created:', response.data);
      
    } catch (error) {
      console.error('Error creating blog:', error);
      setMessage(error.response?.data?.error || 'Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  const memoizedStyles = useMemo(() => ({
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    titleInput: {
      width: '100%',
      padding: '8px',
      fontSize: '16px',
      marginTop: '5px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    editor: {
      height: '400px',
      marginTop: '5px',
    },
    submitButton: {
      padding: '10px 20px',
      backgroundColor: loading ? '#cccccc' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: loading ? 'not-allowed' : 'pointer',
      marginTop: '40px',
    },
    message: {
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '4px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #ddd',
    },
    preview: {
      marginTop: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
  }), [loading]);

  const memoizedPreview = useMemo(() => {
    if (!title && !content) return null;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const images = tempDiv.getElementsByTagName('img');
    for (let img of images) {
      img.style.maxWidth = '100%';
      img.style.maxHeight = '500px';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.margin = '10px auto';
    }

    return (
      <div style={memoizedStyles.preview}>
        <h3>Preview:</h3>
        <h4>{title}</h4>
        <div dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />
      </div>
    );
  }, [title, content, memoizedStyles.preview]);

  return (
    <div style={memoizedStyles.container}>
      <h2>Create New Blog Post</h2>
      {message && (
        <div style={memoizedStyles.message}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={memoizedStyles.formGroup}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={memoizedStyles.titleInput}
            placeholder="Enter blog title"
          />
        </div>
        <div style={memoizedStyles.formGroup}>
          <label>Content:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            style={memoizedStyles.editor}
            placeholder="Write your blog content here..."
          />
        </div>
        <button 
          type="submit" 
          style={memoizedStyles.submitButton}
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Blog'}
        </button>
      </form>

      {memoizedPreview}
    </div>
  );
};

export default BlogEditor;