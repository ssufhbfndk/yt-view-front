import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./UserLogin.css"; // Custom CSS file for additional styling

const UserLogin = () => {
  const { user, userLogin, admin, adminLogin } = useAuth(); // Get user & login functions from context
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If already logged in, redirect to profile/dashboard depending on user type
  useEffect(() => {
    if (user) {
      console.log("User is already logged in, redirecting to profile...");
      navigate("/userprofile"); // Redirects if user is logged in
    } else if (admin) {
      console.log("Admin is already logged in, redirecting to dashboard...");
      navigate("/dashboard"); // Redirect if admin is logged in
    }
  }, [user, admin, navigate]); // Ensure the effect runs when user or admin changes

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      // First, try user login
      const userResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/clientUser/login`,
        { username },
        { withCredentials: true }
      );

      if (userResponse.data.success) {
        userLogin(userResponse.data.clientUser); // Set user in context
        console.log("User logged in, redirecting...");
        // Wait for the state to update and then redirect
        setTimeout(() => {
          navigate("/userprofile"); // Redirect to profile after state is updated
        }, 100); // Delay for state update to take effect
      } else {
        // If user login fails, try admin login
        const adminResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/login`,
          { username },
          { withCredentials: true }
        );

        console.log("Admin Login Response:", adminResponse.data);

        if (adminResponse.data.success) {
          adminLogin(adminResponse.data.admin); // Set admin in context
          navigate("/dashboard"); // Redirect to dashboard
        } else {
          setError("Invalid Credentials");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="user-login-container d-flex justify-content-center align-items-center vh-100">
      <div className="card login-card p-4 shadow">
        <h2 className="text-center mb-4">User Login</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!username.trim()}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;