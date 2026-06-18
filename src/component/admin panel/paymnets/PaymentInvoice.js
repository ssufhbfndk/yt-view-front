import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaFileInvoiceDollar,
  FaUser,
  FaUniversity,
  FaCreditCard,
  FaUserTie,
  FaClipboardCheck,
} from "react-icons/fa";

import "./PaymentInvoice.css";

const PaymentInvoice = ({
  show,
  onClose,
  transaction,
  onUpdateTransaction,
}) => {

  const [status, setStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});

const currentStatus = transaction ? String(transaction.status) : "";


 useEffect(() => {
  if (!transaction) return;

  setStatus(String(transaction?.status || ""));
  setInvoiceNumber(transaction?.invoice_num || "");
}, [transaction]);

  if (!show || !transaction) return null;

  const showToast = (message, type = "success") => {
  setToast({
    show: true,
    message,
    type,
  });

  setTimeout(() => {
    setToast({ show: false, message: "", type: "success" });
  }, 3000);
};

//BLOCK INVALID CHANGES
const isInvalidTransition = () => {
  // completed or rejected is LOCKED
  if (currentStatus === "1" || currentStatus === "2") {
    return true;
  }

  // same status update useless
  if (currentStatus === status) {
    return true;
  }

  return false;
};

  // SUBMIT API
  const submitUpdate = async () => {

    try {

      setLoading(true);

      const response = await axios.put(
  `${process.env.REACT_APP_API_URL}/payment/update-transaction-status`,
  {
    transaction_id: transaction.id,
    status,
    invoice_number: status === "1" ? invoiceNumber : "",
  },
  {
    withCredentials: true, // 🔐 IMPORTANT
  }
);

    showToast(response.data.message || "Updated Successfully", "success");

/* UPDATE CURRENT ROW INSTANTLY */
onUpdateTransaction({
  id: transaction.id,

  status: status,

  updated_at:
    response?.data?.updated_at ||
    new Date().toISOString(),

  invoice_num: invoiceNumber,
});

/* CLOSE MODAL */
onClose();

    } catch (error) {

     showToast(error?.response?.data?.message || "Update Failed", "error");

    } finally {

      setLoading(false);
    }
  };

  // BUTTON CLICK
const handleSubmit = () => {
  if (isInvalidTransition()) {
    showToast("This transaction is locked and cannot be updated", "error");
    return;
  }

  if (status === "1" && invoiceNumber.trim() === "") {
    showToast("Invoice Number Required", "error");
    return;
  }

  setShowAlert(true);
};

  return (

    <>
    {toast.show && (
  <div
    className="position-fixed top-0 end-0 p-3"
    style={{ zIndex: 999999 }}
  >
    <div
      className={`toast show text-white ${
        toast.type === "success" ? "bg-success" : "bg-danger"
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
            setToast({ show: false, message: "", type: "success" })
          }
        />
      </div>
    </div>
  </div>
)}
      <div className="invoice-overlay">

        <div className="invoice-container">

          {/* HEADER */}
          <div className="invoice-top">

            <div className="invoice-logo">

              <FaFileInvoiceDollar />

            </div>

            <div className="invoice-title-area">

  <h1>
    Payment Invoice
  </h1>

  <p>
    Manage Transaction Details
  </p>

</div>

            <button
              className="close-button"
              onClick={onClose}
            >
              ×
            </button>

          </div>

          {/* BODY */}
          <div className="invoice-body">

            {/* ROW */}
            <div className="invoice-field">

              <div className="field-icon">
                <FaClipboardCheck />
              </div>

              <div className="field-content">

                <label>
                  Transaction ID
                </label>

                <input
                  type="text"
                  value={transaction.id}
                  readOnly
                />

              </div>

            </div>

            {/* USER */}
            <div className="invoice-field">

              <div className="field-icon">
                <FaUser />
              </div>

              <div className="field-content">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  value={
                    transaction.username
                  }
                  readOnly
                />

              </div>

            </div>

            {/* BANK */}
            <div className="invoice-field">

              <div className="field-icon">
                <FaUniversity />
              </div>

              <div className="field-content">

                <label>
                  Bank Name
                </label>

                <input
                  type="text"
                  value={
                    transaction.bank_name
                  }
                  readOnly
                />

              </div>

            </div>

            {/* ACCOUNT */}
            <div className="invoice-field">

              <div className="field-icon">
                <FaCreditCard />
              </div>

              <div className="field-content">

                <label>
                  Account Number
                </label>

                <input
                  type="text"
                  value={
                    transaction.bank_account_number
                  }
                  readOnly
                />

              </div>

            </div>

            {/* HOLDER */}
            <div className="invoice-field">

              <div className="field-icon">
                <FaUserTie />
              </div>

              <div className="field-content">

                <label>
                  Holder Name
                </label>

                <input
                  type="text"
                  value={
                    transaction.account_holder_name
                  }
                  readOnly
                />

              </div>

            </div>
                  {/* PKR PRICE */}
<div className="invoice-field">

  <div className="field-icon">
    <FaFileInvoiceDollar />
  </div>

  <div className="field-content">

    <label>PKR Price</label>

    <input
      type="text"
      value={transaction.amount_pkr || transaction.pkr_price || 0}
      readOnly
    />

  </div>

</div>
            {/* STATUS */}
            <div className="invoice-field">

              <div className="field-icon">
                <FaClipboardCheck />
              </div>

              <div className="field-content">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                >
                  <option value="0">
                    Pending
                  </option>

                  <option value="1">
                    Completed
                  </option>

                  <option value="2">
                    Rejected
                  </option>
                </select>

              </div>

            </div>

            {/* INVOICE NUMBER */}
            <div className="invoice-field full-width">

              <div className="field-icon">
                <FaFileInvoiceDollar />
              </div>

              <div className="field-content">

                <label>
                  Invoice Number
                </label>

               <input
  type="text"
  value={invoiceNumber}
  onChange={(e) => setInvoiceNumber(e.target.value)}
  placeholder="Enter Invoice Number"

  disabled={
    transaction?.invoice_num &&
    transaction.invoice_num.trim() !== ""
  }
/>

              </div>

            </div>

          </div>

          {/* BUTTON */}
          <div className="invoice-footer">

            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Invoice"}
            </button>

          </div>

        </div>

      </div>

      {/* CUSTOM ALERT */}
      {showAlert && (

        <div className="custom-alert-overlay">

          <div className="custom-alert">

            <h2>
              Confirm Submission
            </h2>

            <p>
              Are you sure you want
              to update this
              transaction?
            </p>

            <div className="alert-buttons">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowAlert(false)
                }
              >
                Cancel
              </button>

              <button
                className="ok-btn"
                onClick={() => {

                  setShowAlert(false);

                  submitUpdate();
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

export default PaymentInvoice;