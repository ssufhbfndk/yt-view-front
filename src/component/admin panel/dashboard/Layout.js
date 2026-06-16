import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../main/Sidebar";
import Navbar from "../main/Navbar";
import "./Layout.css";
import PullToRefresh from "pulltorefreshjs";
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

  // =========================
  // PULL TO REFRESH
  // =========================
  useEffect(() => {

    PullToRefresh.init({
      mainElement: ".content-area",

      onRefresh() {
        window.location.reload();
      },

      shouldPullToRefresh: () => {
        const el = document.querySelector(".content-area");
        return el && el.scrollTop <= 0;
      },

      distThreshold: 80,
      distMax: 100,
    });

    return () => PullToRefresh.destroyAll();

  }, []);

  // =========================
  // FCM TOKEN REGISTER (BEST WAY)
  // =========================
  useEffect(() => {

    if (!admin?.id) return;

    const initFCM = async () => {

      try {

        const token = await requestNotificationPermission();

        if (!token) return;

        // avoid duplicate API calls
        const savedToken = localStorage.getItem("fcm_token");

        if (savedToken === token) return;

        await axios.post("/api/admin/save-web-token", {
          adminId: admin.id,
          token: token
        });

        localStorage.setItem("fcm_token", token);

        console.log("FCM Token Saved:", token);

      } catch (error) {
        console.error("FCM Error:", error);
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