import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Button,
  IconButton,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 400,
  },
}));

export default function Form({ open = true, onClose = () => {} }) {
  const [formData, setFormData] = useState({
    id_user: '',
    id_post: '',
    report_reason: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://be-android-project.onrender.com/api/report/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Response:', response.data);
      onClose(); // Đóng dialog sau khi submit thành công
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        Report Post
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            label="User ID"
            type="text"
            fullWidth
            name="id_user"
            value={formData.id_user}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Post ID"
            type="text"
            fullWidth
            name="id_post"
            value={formData.id_post}
            onChange={handleChange}
            required
          />
          <FormControl component="fieldset" margin="dense">
            <RadioGroup
              name="report_reason"
              value={formData.report_reason}
              onChange={handleChange}
              required
            >
              <FormControlLabel value="Spam" control={<Radio />} label="Spam" />
              <FormControlLabel value="Inappropriate" control={<Radio />} label="Inappropriate" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </StyledDialog>
  );
}