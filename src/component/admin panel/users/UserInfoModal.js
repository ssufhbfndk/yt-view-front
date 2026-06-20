import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaMobileAlt,
  FaUserCheck,
  FaEnvelope
} from "react-icons/fa";

import "./UserInfoModal.css";

const UserInfoModal = ({
  show,
  onClose,
  user,
  onUpdateUser,
}) => {

  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState("1");

  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  // ✅ TOAST
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {

    if (user) {
      setMobile(user.number || "");
      setStatus(String(user.status));
    }

  }, [user]);

  if (!show || !user) return null;

  // ✅ TOAST FUNCTION
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

  // ✅ UPDATE API
  const submitUpdate = async () => {

    try {

      setLoading(true);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/update-user`,
        {
          user_id: user.id,
          number: mobile,
          status,
        },
        {
         withCredentials: true, // 🔐 IMPORTANT
        }
      );

      // ✅ UPDATE ROW AUTO
      onUpdateUser({
        id: user.id,
        number: mobile,
        status,
      });

      // ✅ SUCCESS TOAST
      showToast(
        response?.data?.message ||
        "User Updated Successfully",
        "success"
      );

      // ✅ CLOSE MODAL
      onClose();

    } catch (error) {

      showToast(
        error?.response?.data?.message ||
        "Update Failed",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <>

      {/* ✅ TOAST */}
      {toast.show && (

        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 999999 }}
        >

          <div
            className={`toast show text-white ${
              toast.type === "success"
                ? "bg-success"
                : "bg-danger"
            }`}
            role="alert"
          >

            <div className="d-flex">

              <div className="toast-body">
                {toast.message}
              </div>

              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() =>
                  setToast({
                    show: false,
                    message: "",
                    type: "success",
                  })
                }
              />

            </div>

          </div>

        </div>

      )}

      {/* MODAL */}
      <div className="user-modal-overlay">

        <div className="user-modal-container">

          {/* HEADER */}
          <div className="user-modal-top">

            <div className="user-modal-title">

              <h1>
                User Information
              </h1>

              <p>
                Manage User Details
              </p>

            </div>

            <button
              className="user-close-btn"
              onClick={onClose}
            >
              ×
            </button>

          </div>

          {/* BODY */}
          <div className="user-modal-body">

            {/* NAME */}
            <div className="user-field">

              <div className="user-field-icon">
                <FaUser />
              </div>

              <div className="user-field-content">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={user.name}
                  disabled
                />

              </div>

            </div>

            {/* USERNAME */}
            <div className="user-field">

              <div className="user-field-icon">
                <FaUser />
              </div>

              <div className="user-field-content">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  value={user.username}
                  disabled
                />

              </div>

            </div>
{/* EMAIL */}
<div className="user-field">

  <div className="user-field-icon">
    <FaEnvelope />
  </div>

  <div className="user-field-content">

    <label>
      Email
    </label>

    <input
      type="email"
      value={user.email || ""}
      disabled
    />

  </div>

</div>
            {/* MOBILE */}
            <div className="user-field">

              <div className="user-field-icon">
                <FaMobileAlt />
              </div>

              <div className="user-field-content">

                <label>
                  Mobile Number
                </label>

                <input
                  type="text"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value)
                  }
                />

              </div>

            </div>

            {/* STATUS */}
            <div className="user-field">

              <div className="user-field-icon">
                <FaUserCheck />
              </div>

              <div className="user-field-content">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >

                  <option value="1">
                    Active
                  </option>

                  <option value="0">
                    Deactive
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="user-modal-footer">

            <button
              className="user-submit-btn"
              disabled={loading}
              onClick={() =>
                setShowAlert(true)
              }
            >

              {loading
                ? "Updating..."
                : "Update User"}

            </button>

          </div>

        </div>

      </div>

      {/* ALERT */}
      {showAlert && (

        <div className="user-alert-overlay">

          <div className="user-alert-box">

            <h2>
              Confirm Update
            </h2>

            <p>
              Are you sure you want
              to update this user?
            </p>

            <div className="user-alert-buttons">

              <button
                className="user-cancel-btn"
                onClick={() =>
                  setShowAlert(false)
                }
              >
                Cancel
              </button>

              <button
                className="user-ok-btn"
                disabled={loading}
                onClick={() => {

                  setShowAlert(false);

                  submitUpdate();

                }}
              >
                {loading ? "Please Wait..." : "OK"}
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default UserInfoModal;