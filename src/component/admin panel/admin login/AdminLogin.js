import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  FaUserShield,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaExclamationTriangle
} from "react-icons/fa";

import "./AdminLogin.css";

const AdminLogin = () => {

  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!username.trim()) {
      return setError("Username is required");
    }

    if (!password.trim()) {
      return setError("Password is required");
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        adminLogin(data.admin);
        navigate("/dashboard");

      } else {

        setError(data.message || "Invalid Credentials");
      }

    } catch (err) {

      setError("Server Error");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="admin-login-container">

      {/* TOAST ERROR (TOP NOTIFICATION) */}
      {error && (
        <div className="toast-error">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
      )}

      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">

          <div className="login-icon">
            <FaUserShield />
          </div>

          <h2>Admin Panel</h2>
          <p>Secure Login Access</p>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div className="field">

            <label>Username</label>

            <div className="input-box">

              <span className="icon">
                <FaUser />
              </span>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="field">

            <label>Password</label>

            <div className="input-box">

              <span className="icon">
                <FaLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : (
              <>
                <FaSignInAlt className="me-2" />
                Login
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;