import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment
} from '@mui/material';
import axios from 'axios';

const API_URL = 'https://be-android-project.onrender.com/api';

const CreateUserDialog = ({ open, handleClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    user_role: 'User' 
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      address: '',
      user_role: 'User'
    });
    setAvatar(null);
    setMessage('');
  };

  const handleCreate = async () => {
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
      await axios.post(`http://localhost:5000/api/auth/admin/create-user`, submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(localStorage.getItem("token"));
      resetForm();
      onUserCreated();
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(error.response?.data?.error || 'Error creating user');
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
      <DialogTitle>Create User</DialogTitle>
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
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            name="user_role"
            value={formData.user_role}
            onChange={handleInputChange}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Renter">Renter</MenuItem>
          </Select>
        </FormControl>

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
          onClick={handleCreate} 
          color="primary" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
