import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FaUsers,
  FaHome,
  FaMoneyBillWave,
  FaChevronDown,
  FaSignOutAlt,
  FaUserEdit,
  FaClipboardList,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = ({
  isSidebarOpen,
  handleLogout,
  setIsSidebarOpen,
}) => {

  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ✅ SAFE FUNCTION CHECK (IMPORTANT FIX)
  const safeSetSidebar = (value) => {
    if (typeof setIsSidebarOpen === "function") {
      setIsSidebarOpen(value);
    }
  };

  
  // ✅ CLOSE SIDEBAR MOBILE
  const closeSidebarMobile = () => {
    if (window.innerWidth < 992) {
      safeSetSidebar(false);
    }
  };

  // ✅ AUTO CLOSE ON ROUTE CHANGE (BEST FIX)
  useEffect(() => {
    if (window.innerWidth < 992) {
      safeSetSidebar(false);
    }
  }, [location.pathname]);

  // ✅ NAV CLICK
  const handleNavClick = () => {

  // ✅ close all dropdowns
  setActiveDropdown(null);

  // ✅ mobile sidebar close
  closeSidebarMobile();
};

  // ✅ DROPDOWN TOGGLE
  const toggleDropdown = (menu) => {

  // only one dropdown open at a time
  if (activeDropdown === menu) {
    setActiveDropdown(null);
  } else {
    setActiveDropdown(menu);
  }

};

  // ✅ LOGOUT SAFE
  const handleLogoutClick = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>

      <div className="sidebar-content">
        <ul>

          <li>
            <Link to="/dashboard" onClick={handleNavClick}
              className={location.pathname === "/dashboard" ? "active-link" : ""}
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link to="/update-profile" onClick={handleNavClick}
              className={location.pathname === "/update-profile" ? "active-link" : ""}
            >
              <FaUserEdit />
              <span>Update Profile</span>
            </Link>
          </li>

          {/* USERS */}
          <li className="dropdown-wrapper">
            <button
              className={`dropdown-btn ${activeDropdown === "users" ? "dropdown-active" : ""}`}
              onClick={() => toggleDropdown("users")}
            >
              <div className="dropdown-left">
                <FaUsers />
                <span>Users</span>
              </div>

              <FaChevronDown
                className={`dropdown-arrow ${activeDropdown === "users" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-menu-custom ${activeDropdown === "users" ? "show-dropdown" : ""}`}>
              <Link to="/add-user" onClick={handleNavClick}>Add User</Link>
              <Link to="/view-user" onClick={handleNavClick}>View Users</Link>
            </div>
          </li>

          {/* ORDERS */}
          <li className="dropdown-wrapper">
            <button
              className={`dropdown-btn ${activeDropdown === "orders" ? "dropdown-active" : ""}`}
              onClick={() => toggleDropdown("orders")}
            >
              <div className="dropdown-left">
                <FaClipboardList />
                <span>Orders</span>
              </div>

              <FaChevronDown
                className={`dropdown-arrow ${activeDropdown === "orders" ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-menu-custom ${activeDropdown === "orders" ? "show-dropdown" : ""}`}>
              <Link to="/add-order" onClick={handleNavClick}>Add Order</Link>
              <Link to="/view-order" onClick={handleNavClick}>View Orders</Link>
            </div>
          </li>

          <li>
            <Link to="/transactions" onClick={handleNavClick}
              className={location.pathname === "/transactions" ? "active-link" : ""}
            >
              <FaMoneyBillWave />
              <span>Payments</span>
            </Link>
          </li>

        </ul>
      </div>

      {/* LOGOUT */}
      <div className="logout-section">
        <button
          className="logout-btn"
          onClick={handleLogoutClick}
          disabled={logoutLoading}
        >
          <FaSignOutAlt />
          <span>
            {logoutLoading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;