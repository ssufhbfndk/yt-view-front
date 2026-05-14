import React from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "./Navbar.css";

const Navbar = ({ admin, toggleSidebar }) => {
  return (
    <nav className="navbar custom-navbar fixed-top">
      <div className="container-fluid navbar-wrapper">

        {/* LEFT SIDE */}
        <div className="left-navbar">

          {/* MENU BUTTON */}
          <button
            className="menu-btn d-lg-none"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>

          {/* LOGO */}
          <Link to="/" className="navbar-brand custom-logo">
            <span className="logo-text">
              YT <span>Hub</span>
            </span>
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="right-navbar">

          {/* NOTIFICATION */}
          <div className="notification-box">
            <FaBell />

            <span className="notification-dot"></span>
          </div>

          {/* PROFILE */}
          <div className="admin-profile">

            <FaUserCircle className="admin-icon" />

            <div className="admin-info">

              <span className="admin-role">
                Admin
              </span>

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