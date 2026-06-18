import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../main/Sidebar";
import Navbar from "../main/Navbar";
import "./Layout.css";
import axios from "axios";

import { requestNotificationPermission } from "../../../firebase";

const Layout = () => {

  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // =========================
  // ROUTE CHANGE (NO LOADING BAR)
  // =========================
  useEffect(() => {
    // optional logic
  }, [location.pathname]);

  // PULL TO REFRESH
  // =========================
 
  // =========================
  // FCM TOKEN REGISTER (BEST WAY)
  // =========================
  useEffect(() => {

  if (!admin?.id) return;

  const initFCM = async () => {

    try {

      const token = await requestNotificationPermission();

      if (!token) return;

      const oldToken =
        localStorage.getItem("fcm_token");

      if (oldToken === token) {
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/save-web-token`,
        {
          adminId: admin.id,
          oldToken,
          newToken: token
        }
      );

      if (response.data.success) {

        localStorage.removeItem("fcm_token");

        localStorage.setItem(
          "fcm_token",
          token
        );

      }

      console.log(
        "FCM Token Saved:",
        token
      );

    } catch (error) {

      console.error(
        "FCM Error:",
        error
      );

    }

  };

  initFCM();

}, [admin?.id]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await adminLogout();
    localStorage.removeItem("fcm_token");
    navigate("/adminlogin");
  };

  // =========================
  // SIDEBAR TOGGLE
  // =========================
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="layout-container">

      <Navbar
        admin={admin}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar
        admin={admin}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="content-area">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;