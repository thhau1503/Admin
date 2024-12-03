import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_URL = 'https://be-android-project.onrender.com/api';

const UpdateUserDialog = ({ open, handleClose, userId, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    
    if (userId && open) {
      axios.get(`${API_URL}/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then(response => {
          if (mounted) {
            const user = response.data;
            setFormData({
              username: user.username || '',
              email: user.email || '',
              password: '',
              phone: user.phone || '',
              address: user.address || ''
            });
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setMessage('Error fetching user data');
        });
    }

    return () => {
      mounted = false;
    };
  }, [userId, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    });
    setAvatar(null);
    setMessage('');
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');

    const submitFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        submitFormData.append(key, formData[key]);
      }
    });
    if (avatar) {
      submitFormData.append('avatar', avatar);
    }

    try {
      await axios.put(`${API_URL}/auth/users/${userId}`, submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      resetForm();
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage(error.response?.data?.error || 'Error updating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        resetForm();
        handleClose();
      }}
    >
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <TextField
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
        />
        <TextField
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
        />
        <TextField
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleInputChange}
          margin="normal"
          fullWidth
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          style={{ marginTop: '10px' }}
        />
        {message && <Typography color="error">{message}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            resetForm();
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpdate} 
          color="primary" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserDialog;