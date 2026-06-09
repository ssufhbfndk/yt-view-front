import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import "./AdminProfile.css";
import { FaUserCircle, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminProfile = () => {
  const { admin } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // PASSWORD VALIDATION
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasLetter && hasNumber && hasSpecial;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword } = passwordData;

    if (!currentPassword || !newPassword) {
      return showToast("Both fields are required", "danger");
    }
 // 2. Same password check
  if (currentPassword === newPassword) {
    return showToast(
      "New password cannot be same as current password",
      "danger"
    );
  }
    if (!validatePassword(newPassword)) {
      return showToast(
        "Password must be 8+ chars, include letter, number & special char",
        "danger"
      );
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/change-password`,
        { currentPassword, newPassword ,}, {
    withCredentials: true
  }
      );

      showToast(res.data.message || "Password updated successfully", "success");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Error occurred", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast.show && (
        <div className={`app-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="profile-wrapper">

        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-header">
            <FaUserCircle size={40} />
            <h2>Admin Profile</h2>
          </div>

          <div className="profile-body">
            <div className="info-box">
              <label>Name</label>
              <div className="value">{admin?.name}</div>
            </div>

            <div className="info-box">
              <label>Username</label>
              <div className="value">{admin?.username}</div>
            </div>
          </div>
        </div>

        {/* PASSWORD CARD */}
        <div className="password-card">
          <div className="profile-header">
            <FaKey size={30} />
            <h3>Change Password</h3>
          </div>

          <form onSubmit={handleSubmit}>

            {/* CURRENT PASSWORD */}
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handleChange}
              />
              <span onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* NEW PASSWORD */}
            <div className="password-field">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handleChange}
              />
              <span onClick={() => setShowNew(!showNew)}>
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>
        </div>

      </div>
    </>
  );
};

export default AdminProfile;