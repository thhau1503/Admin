import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  TablePagination,
  Box
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "#fff"
}));

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://be-android-project.onrender.com/api/report/getAll', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      let url = '';
      if (newStatus === 'Processing') {
        url = `https://be-android-project.onrender.com/api/report/${reportId}/status/processing`;
      } else if (newStatus === 'Resolved') {
        url = `https://be-android-project.onrender.com/api/report/${reportId}/status/resolved`;
      }
      await axios.patch(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReports(reports.map(report => report._id === reportId ? { ...report, status: newStatus } : report));
    } catch (error) {
      console.error('Failed to update report status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "Processing":
        return "warning";
      case "Pending":
        return "error";
      default:
        return "default";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const filteredReports = filterStatus === 'all' ? reports : reports.filter(report => report.status === filterStatus);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="reports table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Post</StyledTableCell>
              <StyledTableCell>Post ID</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report.id_user.username}</TableCell>
                <TableCell>{report.id_post.title}</TableCell>
                <TableCell>{report.id_post._id}</TableCell>
                <TableCell>{report.report_reason}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>
                  <Chip label={report.status} color={getStatusColor(report.status)} />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report._id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default ReportManagement;