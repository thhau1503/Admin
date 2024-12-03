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
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "#fff"
}));

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('https://be-android-project.onrender.com/api/notification');
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://be-android-project.onrender.com/api/auth/users',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const handleCreateOrEdit = async () => {
    try {
      if (editingNotification._id) {
        // Update notification
        await axios.put(`https://be-android-project.onrender.com/api/notification/${editingNotification._id}`, editingNotification);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === editingNotification._id ? editingNotification : notif
          )
        );
        fetchNotifications();
      } else {
        // Create new notification
        const response = await axios.post('https://be-android-project.onrender.com/api/notification/create', editingNotification);
        setNotifications((prev) => [...prev, response.data]);
        fetchNotifications();
      }
      setEditingNotification(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create or edit notification', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://be-android-project.onrender.com/api/notification/${selectedNotificationId}`);
      setNotifications(notifications.filter(notification => notification._id !== selectedNotificationId));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingNotification({ id_user: "", message: "" });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (notification) => {
    setEditingNotification(notification);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (notificationId) => {
    setSelectedNotificationId(notificationId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNotification(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedNotificationId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenCreateDialog} sx={{ marginBottom: 2 }}>
        Create Notification
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="notifications table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Receiver</StyledTableCell>
              <StyledTableCell>Content</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((notification) => (
              <TableRow key={notification._id}>
                <TableCell>{notification.id_user ? notification.id_user.username : 'N/A'}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{new Date(notification.create_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(notification)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(notification._id)}>
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
          count={notifications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingNotification?._id ? "Edit Notification" : "Create Notification"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              value={editingNotification?.id_user || ""}
              onChange={(e) => setEditingNotification({ ...editingNotification, id_user: e.target.value })}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Message"
            value={editingNotification?.message || ""}
            onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
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
            {editingNotification?._id ? "Save" : "Create"}
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
            Are you sure you want to delete this notification permanently?
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

export default Notifications;