import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Box,
  TablePagination,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import { styled } from '@mui/system';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "#fff"
}));

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [postFilter, setPostFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://be-android-project.onrender.com/api/post/getAll');
        setPosts(response.data);
      } catch (error) {
        setError("Failed to fetch posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      case "Deleted":
        return "error";
      default:
        return "default";
    }
  };

  const handleApprove = async (postId) => {
    try {
      await axios.put(`https://be-android-project.onrender.com/api/post/${postId}/activate`, { status: 'Active' }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setPosts(posts.map(post => post._id === postId ? { ...post, status: 'Active' } : post));
    } catch (error) {
      console.error('Failed to approve post', error);
    }
  };

  const handleReject = async (postId) => {
    try {
      await axios.put(`https://be-android-project.onrender.com/api/post/${postId}/delete`, { status: 'Deleted' }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setPosts(posts.map(post => post._id === postId ? { ...post, status: 'Deleted' } : post));
    } catch (error) {
      console.error('Failed to reject post', error);
    }
  };

  const handleDeletePermanently = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://be-android-project.onrender.com/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post permanently', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (postFilter !== "all" && post.status !== postFilter) return false;
    return (
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.landlord.username && post.landlord.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleOpenDialog = (postId) => {
    setSelectedPostId(postId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPostId(null);
  };

  return (
    <>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Status</InputLabel>
        <Select
          value={postFilter}
          onChange={(e) => setPostFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Deleted">Deleted</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table aria-label="posts table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Room Type</StyledTableCell>
              <StyledTableCell>Renter</StyledTableCell>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  <Tooltip title={post.title}>
                    <span>{post.title.length > 20 ? `${post.title.substring(0, 20)}...` : post.title}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip label={post.status} color={getStatusColor(post.status)} />
                </TableCell>
                <TableCell>{post.price}</TableCell>
                <TableCell>{post.location.address}, {post.location.district}, {post.location.city}</TableCell>
                <TableCell>{post.roomType}</TableCell>
                <TableCell>{post.landlord.username}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="row" flexWrap="wrap">
                    {post.images.map((image, index) => (
                      <a key={index} href={image.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          style={{ width: '50px', height: '50px', marginRight: '5px', marginBottom: '5px' }}
                        />
                      </a>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {post.status === 'Pending' ? (
                    <>
                      <IconButton size="small" color="primary" onClick={() => handleApprove(post._id)}>
                        <FaCheck />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleReject(post._id)}>
                        <FaTimes />
                      </IconButton>
                    </>
                  ) : post.status === 'Deleted' ? (
                    <>
                      <IconButton size="small" color="primary" onClick={() => handleApprove(post._id)}>
                        <FaEdit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDialog(post._id)}>
                        <FaTrash />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton size="small" color="primary" onClick={() => handleReject(post._id)}>
                        <FaEdit />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPosts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePermanently(selectedPostId)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostManagement;