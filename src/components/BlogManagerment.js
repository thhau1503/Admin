import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  TablePagination,
  DialogContentText
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "#fff"
}));

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog');
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
        console.error('Unexpected response data:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateOrEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editingBlog._id) {
        // Update blog
        await axios.put(`http://localhost:5000/api/blog/${editingBlog._id}`, editingBlog, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBlogs((prev) =>
          prev.map((blog) =>
            blog._id === editingBlog._id ? editingBlog : blog
          )
        );
      } else {
        // Create new blog
        const response = await axios.post('http://localhost:5000/api/blog', editingBlog, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBlogs((prev) => [...prev, response.data]);
      }
      setEditingBlog(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create or edit blog:', error);
      setError('Failed to create or edit blog');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/blog/${selectedBlogId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBlogs(blogs.filter(blog => blog._id !== selectedBlogId));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete blog:', error);
      setError('Failed to delete blog');
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingBlog({ title: "", content: "" });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (blog) => {
    setEditingBlog(blog);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (blogId) => {
    setSelectedBlogId(blogId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBlogId(null);
  };

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

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenCreateDialog} sx={{ marginBottom: 2 }}>
        Create Blog
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="blogs table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Content</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell dangerouslySetInnerHTML={{ __html: blog.content }} />
                <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(blog)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(blog._id)}>
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={blogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingBlog?._id ? "Edit Blog" : "Create Blog"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editingBlog?.title || ""}
            onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Content"
            value={editingBlog?.content || ""}
            onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateOrEdit} color="primary">
            {editingBlog?._id ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this blog permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogManagement;