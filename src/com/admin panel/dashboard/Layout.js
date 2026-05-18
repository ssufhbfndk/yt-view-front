import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../main/Sidebar";
import Navbar from "../main/Navbar";
import "./Layout.css";

const Layout = () => {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ FIX ADDED

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // =========================
  // 🔥 LOADING BAR ON ROUTE CHANGE
  // =========================
  useEffect(() => {
  // no loading bar
}, [location.pathname]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await adminLogout();
    navigate("/adminlogin");
  };

  // =========================
  // SIDEBAR TOGGLE
  // =========================
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="layout-container">

      {/* NAVBAR */}
      <Navbar admin={admin} toggleSidebar={toggleSidebar} />

      {/* OVERLAY */}
      <div
        className={`overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <Sidebar
        admin={admin}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT */}
      <div className="content-area">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;