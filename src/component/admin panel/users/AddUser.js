import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  FaUser,
  FaMobileAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "./AddUser.css";

const AddUser = () => {
const [showUsernameMsg, setShowUsernameMsg] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [checkingUsername, setCheckingUsername] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState({
    checked: false,
    valid: false,
    message: "",
  });

  // =========================
  // TOAST
  // =========================

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message,
    type = "success"
  ) => {

    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {

      setToast({
        show: false,
        message: "",
        type: "success",
      });

    }, 3000);

  };

  // =========================
  // USERNAME CHECK API
  // =========================

  useEffect(() => {

    const delay = setTimeout(() => {

      checkUsername();

    }, 500);

    return () => clearTimeout(delay);

  }, [username]);

  const checkUsername = async () => {

    try {

      if (username.length < 8) {

        setUsernameStatus({
          checked: false,
          valid: false,
          message: "",
        });

        return;

      }

      const usernameRegex =
        /^[a-z][a-z0-9_]{7,}$/;

      if (!usernameRegex.test(username)) {

        setUsernameStatus({
          checked: true,
          valid: false,
          message:
            "Only small letters, numbers & _ allowed",
        });

        return;

      }

      setCheckingUsername(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/check-username`,
        {
          username,
        }
      );

      if (response.data.exists) {

       setUsernameStatus({
  checked: true,
  valid: false,
  message: "Username already taken",
});

setShowUsernameMsg(true);

setTimeout(() => {
  setShowUsernameMsg(false);
}, 2500);

      } else {

      setUsernameStatus({
  checked: true,
  valid: true,
  message: "Username available",
});

setShowUsernameMsg(true);

setTimeout(() => {
  setShowUsernameMsg(false);
}, 2500);
      }

    } catch (error) {

      setUsernameStatus({
        checked: true,
        valid: false,
        message: "Username check failed",
      });

    } finally {

      setCheckingUsername(false);

    }

  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {

    // NAME
    if (!name.trim()) {

      showToast(
        "Name is required",
        "error"
      );

      return false;

    }

    // USERNAME
    const usernameRegex =
      /^[a-z][a-z0-9_]{7,}$/;

    if (!usernameRegex.test(username)) {

      showToast(
        "Username must be minimum 8 characters with small letters, number & _",
        "error"
      );

      return false;

    }

    if (!usernameStatus.valid) {

      showToast(
        "Username is not available",
        "error"
      );

      return false;

    }

    // MOBILE
    const mobileRegex =
      /^[0-9]{11}$/;

    if (!mobileRegex.test(number)) {

      showToast(
        "Enter valid mobile number",
        "error"
      );

      return false;

    }

    // PASSWORD
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!passwordRegex.test(password)) {

      showToast(
        "Password must contain 8 chars, 1 number & 1 special character",
        "error"
      );

      return false;

    }

    return true;

  };

  // =========================
  // REGISTER
  // =========================

  const registerUser = async () => {

    try {

      if (!validateForm()) {
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/signup`,
        {
          name,
          username,
          number,
          password,
        }
      );

      showToast(
        response.data.message ||
        "Registration Successful",
        "success"
      );

      // RESET
      setName("");
      setUsername("");
      setNumber("");
      setPassword("");

      setUsernameStatus({
        checked: false,
        valid: false,
        message: "",
      });

    } catch (error) {

      showToast(
        error?.response?.data?.message ||
        "Registration Failed",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-container">

      {/* TOAST */}
      {toast.show && (

        <div
          className={`custom-toast ${
            toast.type === "success"
              ? "toast-success"
              : "toast-error"
          }`}
        >
          {toast.message}
        </div>

      )}

      <div className="register-card">

        {/* HEADER */}
        <div className="register-header">

          <div className="register-user-icon">
            <FaUser />
          </div>

          <h2>
            User Registration
          </h2>

          <p>
            Create New User Account
          </p>

        </div>

        {/* FORM */}
        <div className="register-form">

          {/* NAME */}
          <div className="register-field">

            <div className="field-icon">
              <FaUser />
            </div>

            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          {/* USERNAME */}
         <div className="register-field">

  <div className="field-icon">
    <FaUser />
  </div>

  <input
    type="text"
    placeholder="Enter Username"
    value={username}
    onChange={(e) =>
      setUsername(e.target.value.toLowerCase())
    }
  />

  {/* TOOLTIP STATUS */}
  {username.length >= 8 && showUsernameMsg && (
    <div className={`username-tooltip ${
      usernameStatus.valid ? "valid" : "invalid"
    }`}>

      {checkingUsername ? (
        "Checking..."
      ) : (
        usernameStatus.message
      )}

    </div>
  )}

</div>

          {/* MOBILE */}
          <div className="register-field">

            <div className="field-icon">
              <FaMobileAlt />
            </div>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={number}
              onChange={(e) =>
                setNumber(e.target.value)
              }
            />

          </div>

          {/* PASSWORD */}
          <div className="register-field password-field">

            <div className="field-icon">
              <FaLock />
            </div>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              {showPassword
                ? <FaEyeSlash />
                : <FaEye />}

            </button>

          </div>

          {/* BUTTON */}
          <button
            className="register-btn"
            disabled={loading}
            onClick={registerUser}
          >

            {loading
              ? "Please Wait..."
              : "Registration"}

          </button>

        </div>

      </div>

    </div>

  );

};

export default AddUser;