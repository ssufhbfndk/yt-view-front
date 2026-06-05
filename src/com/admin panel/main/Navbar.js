import React, { useEffect, useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaUniversity,
  FaCreditCard,
  FaCoins,
  FaMoneyBillWave,
  FaIdCard
} from "react-icons/fa";
import socket from "../../../socket";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ admin, toggleSidebar }) => {

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
const [notificationCount, setNotificationCount] = useState(0);
const [loadingNotifications, setLoadingNotifications] = useState(false);
const [notificationError, setNotificationError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
const notificationRef = useRef(null);

useEffect(() => {

  const handleOutsideClick = (e) => {

    if (
      notificationRef.current &&
      !notificationRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleOutsideClick
    );
  };

}, []);
  // =========================
  // OPEN NOTIFICATION API
  // =========================
  const openNotification = async (notificationId) => {
    try {
setNotifications(prev =>
  prev.filter(n => n.id !== notificationId)
);

setNotificationCount(prev =>
  Math.max(prev - 1, 0)
);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/open-notification`,
        {
          notification_id: notificationId
        }
      );

      if (res.data.success) {

        

        // set payment detail
        setPaymentDetail(res.data.payment);

        // open modal
        setShowModal(true);
      }

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOAD OLD NOTIFICATIONS
  // =========================
  useEffect(() => {
  const loadCount = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/notification-count`
      );
      setNotificationCount(res.data.count || 0);
    } catch (err) {
      console.log(err);
    }
  };

  loadCount();
}, []);

const handleNotificationClick = async () => {

  setOpen(!open);

  if (open) return;

  setLoadingNotifications(true);
  setNotificationError("");
  setNotifications([]);

  try {

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/notifications`
    );

    setNotifications(
      Array.isArray(res.data)
        ? res.data
        : res.data.notifications || []
    );

  } catch (err) {

    setNotificationError("Notification load nahi hui");

  } finally {

    setLoadingNotifications(false);

  }
};
  // =========================
  // SOCKET LISTENER
  // =========================
  useEffect(() => {

    socket.on("admin_notification", () => {

  setNotificationCount(prev => prev + 1);

});
   

    return () => socket.off("admin_notification");

  }, []);

  return (
    <>

      <nav className="navbar custom-navbar fixed-top">
        <div className="container-fluid navbar-wrapper">

          {/* LEFT */}
          <div className="left-navbar">
            <button
              className="menu-btn d-lg-none"
              onClick={toggleSidebar}
            >
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
            <div
  className="notification-box"
  ref={notificationRef}
  onClick={handleNotificationClick}
>

              <FaBell />

              {/* COUNT */}
              {notificationCount > 0 && (
  <span className="notification-count">
    {notificationCount}
  </span>
)}

              {/* DROPDOWN */}
              {open && (
                <div className="notification-dropdown">

                  {loadingNotifications ? (

  <p className="empty">
    Loading...
  </p>

) : notificationError ? (

  <p className="empty">
    {notificationError}
  </p>

) : notifications.length === 0 ? (

  <p className="empty">
    No notifications
  </p>

) : (

                    (Array.isArray(notifications) ? notifications : []).slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className="notification-item"
                        onClick={() => openNotification(n.id)}
                        style={{ cursor: "pointer" }}
                      >
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

      {/* =========================
          PAYMENT MODAL
      ========================= */}
      {showModal && paymentDetail && (

        <div className="user-modal-overlay">

          <div className="user-modal-container">

            <div className="user-modal-top">

              <div className="user-modal-title d-flex align-items-center gap-2">
                <h1>
  <FaBell style={{ marginRight: "8px", color: "#2563eb" }} />
  Withdrawal Detail
</h1>
               <p>
  <FaUserCircle style={{ marginRight: "6px" }} />
  Payment Information
</p>
              </div>

              <button
                className="user-close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            <div className="user-modal-body">

              <div className="user-field">
                <label>
  <FaIdCard style={{ marginRight: "6px", color: "#2563eb" }} />
  Payment ID
</label>
                <input value={paymentDetail.id || ""} disabled />
              </div>

              <div className="user-field">
                <label>
  <FaUserCircle style={{ marginRight: "6px", color: "#2563eb" }} />
  Username
</label>
                <input value={paymentDetail.username || ""} disabled />
              </div>

              <div className="user-field">
               <label>
  <FaUniversity style={{ marginRight: "6px", color: "#2563eb" }} />
  Bank Name
</label>
                <input value={paymentDetail.bank_name || ""} disabled />
              </div>

              <div className="user-field">
               <label>
  <FaCreditCard style={{ marginRight: "6px", color: "#2563eb" }} />
  Account Holder
</label>
                <input value={paymentDetail.account_holder_name || ""} disabled />
              </div>

              <div className="user-field">
                <label>
  <FaCreditCard style={{ marginRight: "6px", color: "#2563eb" }} />
  Account Number
</label>
                <input value={paymentDetail.bank_account_number || ""} disabled />
              </div>

              <div className="user-field">
               <label>
  <FaCoins style={{ marginRight: "6px", color: "#f59e0b" }} />
  Coins
</label>
                <input value={paymentDetail.coins || ""} disabled />
              </div>

              <div className="user-field">
              <label>
  <FaMoneyBillWave
    style={{
      marginRight: "6px",
      color: "#16a34a"
    }}
  />
  PKR
</label>
                <input value={paymentDetail.amount_pkr || ""} disabled />
              </div>

            </div>

            <div className="user-modal-footer">

              <button
                className="user-submit-btn"
                onClick={() => {
                  setShowModal(false);
                  navigate("/transactions");
                }}
              >
                OK
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default Navbar;