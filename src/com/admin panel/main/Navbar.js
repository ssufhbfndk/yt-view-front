import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import socket from "../../../socket";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ admin, toggleSidebar }) => {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // =========================
  // LOAD OLD NOTIFICATIONS
  // =========================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/notifications`
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, []);

  // =========================
  // SOCKET LISTENER
  // =========================
  useEffect(() => {
    socket.on("admin_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("admin_notification");
  }, []);

  return (
    <nav className="navbar custom-navbar fixed-top">
      <div className="container-fluid navbar-wrapper">

        {/* LEFT */}
        <div className="left-navbar">
          <button className="menu-btn d-lg-none" onClick={toggleSidebar}>
            <FaBars />
          </button>

          <Link to="/" className="navbar-brand custom-logo">
            <span className="logo-text">
              YT <span>Hub</span>
            </span>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="right-navbar">

          {/* NOTIFICATION */}
          <div className="notification-box" onClick={() => setOpen(!open)}>

            <FaBell />

            {/* 🔴 COUNT BADGE */}
            {notifications.length > 0 && (
              <span className="notification-count">
                {notifications.length}
              </span>
            )}

            {/* DROPDOWN */}
            {open && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p className="empty">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="notification-item">
                      <b>{n.title}</b>
                      <p>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* PROFILE */}
          <div className="admin-profile">
            <FaUserCircle className="admin-icon" />

            <div className="admin-info">
              <span className="admin-role">Admin</span>
              <span className="admin-name">
                {admin?.username || "Admin"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;