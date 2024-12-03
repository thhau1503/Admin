import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import DashBoard from "./pages/DashBoard";
import PaymentForm from "./pages/Order";
import MapWithSearch from "./pages/MapboxTest";
import SimpleMap from "./pages/MapVip";
import PostForm from "./pages/PostForm";
import Form from "./pages/Report";
import ScheduleManagement from "./pages/Booking";
import AddressSelector from "./pages/AddressSelector";
import BlogForm from "./pages/Blogtest";
import SearchPost from "./pages/SearchPost";
import GeocodingTest from "./pages/GeocodingTest";
function App1() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    return !!token;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={isAuthenticated() ? <DashBoard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
        <Route path="/order" element={<PaymentForm />} />
        <Route path="/map" element={<SimpleMap />} />
        <Route path="/change" element={< GeocodingTest />} />
        <Route path="/post" element={<PostForm/>} />
        <Route path="/report" element={<Form/>} />
        <Route path="/schedule" element={<ScheduleManagement/>} />
        <Route path="/address" element={<AddressSelector/>} />
        <Route path="/blog" element={<BlogForm/>} />
        <Route path="/spost" element={<GeocodingTest/>} />
      </Routes>
    </Router>
  );
}

export default App1;
