import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, handleLogout }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <ul className="list-unstyled">
          {/* Dashboard */}
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          {/* Update Profile */}
          <li>
            <Link to="/update-profile">Update Profile</Link>
          </li>

          {/* Users Dropdown */}
          <li
            className={`dropdown ${activeDropdown === "users" ? "active" : ""}`}
            onMouseEnter={() => handleMouseEnter("users")}
            onMouseLeave={handleMouseLeave}
          >
            <span className="dropdown-toggle">Users</span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/add-user">Add User</Link>
              </li>
              <li>
                <Link to="/view-user">View Users</Link>
              </li>
            </ul>
          </li>

          {/* Orders Dropdown */}
          <li
            className={`dropdown ${activeDropdown === "orders" ? "active" : ""}`}
            onMouseEnter={() => handleMouseEnter("orders")}
            onMouseLeave={handleMouseLeave}
          >
            <span className="dropdown-toggle">Orders</span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/add-order">Add Order</Link>
              </li>
              <li>
                <Link to="/view-order">View Orders</Link>
              </li>
              <li>
                <Link to="/complete-order">Complete Orders</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
