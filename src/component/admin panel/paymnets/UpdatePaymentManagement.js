import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UpdatePaymentManagement.css";

import {
  FaMoneyBillWave,
  FaUserShield,
  FaUser,
  FaDollarSign,
  FaEdit,
} from "react-icons/fa";

const UpdatePaymentManagement = () => {
  const [tab, setTab] = useState("admin");
const [error, setError] = useState(false);
  const [adminDebit, setAdminDebit] = useState("");
  const [clientRate, setClientRate] = useState("");
  const [dollarRate, setDollarRate] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState({ show: false, type: "", value: "" });

  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  // GET DATA
 const fetchValues = async () => {
  try {
    setLoading(true);
    setError(false);

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/payment/payment-management`,{
    withCredentials: true, // 🔐 IMPORTANT
  }
    );

    setAdminDebit(res.data.adminDebit || "");
    setClientRate(res.data.clientRate || "");
    setDollarRate(res.data.dollarRate || "");

  } catch {
    setError(true);
    showToast("error", "Failed to load data");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchValues();
  }, []);

  const openConfirm = (type, value) => {
    if (!value) return showToast("error", "Enter value first");

    setModal({ show: true, type, value });
  };

  const confirmUpdate = async () => {
    try {
      setSaving(true);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/payment/update-payment-management`,
        {
          type: modal.type,
          value: modal.value,
        },{
    withCredentials: true, // 🔐 IMPORTANT
  }
      );

      showToast("success", "Updated Successfully");
      fetchValues();
      setModal({ show: false, type: "", value: "" });
    } catch {
      showToast("error", "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "admin", label: "Admin Debit", icon: <FaUserShield /> },
    { key: "client", label: "Client Rate", icon: <FaUser /> },
    { key: "dollar", label: "Dollar Rate", icon: <FaDollarSign /> },
  ];

  const Spinner = () => (
  <div className="spinner"></div>
);

const renderLoading = () => {
  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner big"></div>
        <p>Loading payment data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
       
        <button onClick={fetchValues} className="reload-btn">
          🔄 Reload Again
        </button>
      </div>
    );
  }

  return <div className="payment-form">{renderForm()}</div>;
};
  const renderForm = () => {
    if (tab === "admin") {
      return (
        <>
        
          <div className="form-title">
            <FaUserShield /> Admin Debit Rate
          </div>

          <input
            type="number"
            placeholder="Enter admin debit value"
            value={adminDebit}
            onChange={(e) => setAdminDebit(e.target.value)}
          />

          <button
            className={!adminDebit ? "disabled" : ""}
            onClick={() => openConfirm("adminDebit", adminDebit)}
          >
            <FaEdit /> Update Admin Debit
          </button>
        </>
      );
    }

    if (tab === "client") {
      return (
        <>
          <div className="form-title">
            <FaUser /> Client Rate
          </div>

          <input
            type="number"
            placeholder="Enter client rate value"
            value={clientRate}
            onChange={(e) => setClientRate(e.target.value)}
          />

          <button
            className={!clientRate ? "disabled" : ""}
            onClick={() => openConfirm("clientRate", clientRate)}
          >
            <FaEdit /> Update Client Rate
          </button>
        </>
      );
    }

    if (tab === "dollar") {
      return (
        <>
          <div className="form-title">
            <FaDollarSign /> Dollar Exchange Rate
          </div>

          <input
            type="number"
            placeholder="Enter dollar rate"
            value={dollarRate}
            onChange={(e) => setDollarRate(e.target.value)}
          />

          <button
            className={!dollarRate ? "disabled" : ""}
            onClick={() => openConfirm("dollarRate", dollarRate)}
          >
            <FaEdit /> Update Dollar Rate
          </button>
        </>
      );
    }
  };

  return (
    <div className="payment-page">

      {/* TOP HEADER CARD */}
      <div className="top-header main-heading ">
        <FaMoneyBillWave />
        <div >
          <h1 >Payment Management</h1>
          <p>Update admin, client & dollar rates</p>
        </div>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div className={`toast-box ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="payment-card">

        {/* TABS */}
        <div className="payment-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* FORM */}
       {renderLoading()}
      </div>

      {/* MODAL */}
      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-box modern">

            <h3>Confirm Update</h3>

            <p>
              You are updating value to:
              <b> {modal.value}</b>
            </p>

            <div className="modal-actions">
              <button
                className="cancel"
                onClick={() => setModal({ show: false })}
              >
                Cancel
              </button>

              <button
                className="confirm"
                onClick={confirmUpdate}
                disabled={saving}
              >
                {saving ? "Updating..." : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePaymentManagement;