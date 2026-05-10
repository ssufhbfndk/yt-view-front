import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

const Layout = () => {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/adminlogin");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-container">
      {/* Navbar */}
      <Navbar admin={admin} toggleSidebar={toggleSidebar} />

      {/* Overlay (For Closing Sidebar on Small Screens) */}
      <div
        className={`overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <Sidebar admin={admin} isSidebarOpen={isSidebarOpen} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
