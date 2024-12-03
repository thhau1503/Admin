import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { viVN } from '@mui/material/locale';

// Dữ liệu mẫu
const posts = [
  {
    id: 1, title: 'Phòng trọ quận 1', appointments: [
      { date: '2024-11-15', time: '10:00', name: 'Nguyễn Văn A', phone: '0123456789' },
      { date: '2024-11-15', time: '14:00', name: 'Trần Thị B', phone: '0987654321' },
      { date: '2024-11-16', time: '11:00', name: 'Lê Văn C', phone: '0369852147' },
    ]
  },
  {
    id: 2, title: 'Nhà nguyên căn quận 2', appointments: [
      { date: '2024-11-17', time: '09:00', name: 'Phạm Thị D', phone: '0741852963' },
      { date: '2024-11-18', time: '15:00', name: 'Hoàng Văn E', phone: '0258963147' },
    ]
  },
];

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  },
  viVN,
);

export default function RentalSchedule() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
    setSelectedDate(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getDatesWithAppointments = () => {
    if (!selectedPost) return [];
    return [...new Set(selectedPost.appointments.map(app => app.date))];
  };

  const isDateWithAppointment = (date) => {
    if (!selectedPost) return false;
    const formattedDate = format(date, 'yyyy-MM-dd');
    return selectedPost.appointments.some(app => app.date === formattedDate);
  };

  const getAppointmentsForDate = (date) => {
    if (!selectedPost || !date) return [];
    return selectedPost.appointments.filter(app => app.date === format(date, 'yyyy-MM-dd'));
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý lịch hẹn xem nhà
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Danh sách bài đăng
                </Typography>
                {posts.map(post => (
                  <Button
                    key={post.id}
                    onClick={() => handlePostSelect(post)}
                    variant={selectedPost?.id === post.id ? "contained" : "outlined"}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    {post.title}
                  </Button>
                ))}
              </Paper>
            </Grid>
            {selectedPost && (
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedPost.title}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Chọn ngày để xem lịch hẹn
                  </Typography>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateSelect}
                    views={['day']}
                    showDaysOutsideCurrentMonth
                    slots={{
                      day: (props) => {
                        const date = props.day;
                        const hasAppointment = getDatesWithAppointments().includes(format(date, 'yyyy-MM-dd'));
                        const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                        return (
                          <Button
                            {...props}
                            sx={{
                              ...props.sx,
                              margin: '2px',
                              borderRadius: '50%',
                              backgroundColor: isSelected
                                ? '#1976d2 !important'
                                : hasAppointment
                                  ? '#4caf50 !important'
                                  : 'inherit',
                              color: (isSelected || hasAppointment) ? '#fff !important' : 'inherit',
                              '&:hover': {
                                backgroundColor: isSelected
                                  ? '#1565c0 !important'
                                  : hasAppointment
                                    ? '#45a049 !important'
                                    : '',
                              },
                            }}
                          >
                            {format(date, 'd')}
                          </Button>
                        );
                      },
                    }}
                    minDate={new Date('2024-01-01')}
                    maxDate={new Date('2024-12-31')}
                  />
                </Paper>
              </Grid>
            )}
            {selectedDate && (
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Lịch hẹn ngày {format(selectedDate, 'dd/MM/yyyy')}
                  </Typography>
                  <List>
                    {getAppointmentsForDate(selectedDate).map((appointment, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleOpenDialog(appointment)}
                      >
                        <ListItemText
                          primary={`${appointment.time} - ${appointment.name}`}
                          secondary={`SĐT: ${appointment.phone}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedAppointment && (
                  <>
                    <Typography>Ngày: {format(parseISO(selectedAppointment.date), 'dd/MM/yyyy')}</Typography>
                    <Typography>Giờ: {selectedAppointment.time}</Typography>
                    <Typography>Tên: {selectedAppointment.name}</Typography>
                    <Typography>Số điện thoại: {selectedAppointment.phone}</Typography>
                  </>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}