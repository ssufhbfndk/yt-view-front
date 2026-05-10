import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = ({ admin, toggleSidebar }) => {
  return (
    <nav className="navbar navbar-dark bg-dark custom-navbar fixed-top">
      <div className="container-fluid d-flex align-items-center">
        {/* Sidebar Toggle Button */}
        <button className="navbar-toggler d-lg-none me-2" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Website Name */}
        <Link className="navbar-brand" to="/">YT Panel</Link>

        {/* Username */}
        <span className="navbar-text text-white">{admin?.username}</span>
      </div>
    </nav>
  );
};

export default Navbar;
