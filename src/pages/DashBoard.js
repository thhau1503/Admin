import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Tab,
  Tabs,
} from "@mui/material";
import { styled } from "@mui/system";
import UserManagement from "../components/UserManagement";
import PostManagement from "../components/PostManagerment";
import Notifications from "../components/NotificationManagerment";
import Reports from "../components/ReportManagerment";
import Blogs from "../components/BlogManagerment";


const StyledTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    justifyContent: "space-between",
    width: "100%"
  },
  "& .MuiTab-root": {
    flexGrow: 1,
    maxWidth: "none"
  }
});


const DashBoard = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const reports = [
    { id: 1, type: "Bug", submittedBy: "John Doe", date: "2024-01-15", status: "Open" },
    { id: 2, type: "Feature", submittedBy: "Jane Smith", date: "2024-01-16", status: "In Progress" },
    { id: 3, type: "Support", submittedBy: "Mike Johnson", date: "2024-01-17", status: "Closed" }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: "100%", mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="admin dashboard tabs"
              variant="fullWidth"
              sx={{ minHeight: 48 }}
            >
              <Tab label="User Management" sx={{ textTransform: "none" }} />
              <Tab label="Post Management" sx={{ textTransform: "none" }} />
              <Tab label="Notifications" sx={{ textTransform: "none" }} />
              <Tab label="Reports" sx={{ textTransform: "none" }} />
              <Tab label="Blog" sx={{ textTransform: "none" }} />
            </StyledTabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
          <UserManagement/>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
          <PostManagement/>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Notifications />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Reports reports={reports} />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Blogs />
          </TabPanel>
        </Box>
    </Container>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default DashBoard;