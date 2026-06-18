import React, { useState } from "react";
import axios from "axios";
import "./AddOrder.css";

const AddOrder = () => {
  const [tab, setTab] = useState("single");
const [singleLoading, setSingleLoading] = useState(false);
const [multiLoading, setMultiLoading] = useState(false);
  // SINGLE ORDER
  const [orderId, setOrderId] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [seconds, setSeconds] = useState("");

  // MULTI ORDER
  const [multiText, setMultiText] = useState("");

  // TOAST
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  // =========================
  // SINGLE ORDER API
  // =========================
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
if (singleLoading) return;
    if (!orderId || !videoLink || !quantity || !seconds) {
      showToast("error", "All fields are required");
      return;
    }

   try {

  setSingleLoading(true);

  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/orders/single-order`,
    { orderId, videoLink, quantity, seconds },{
    withCredentials: true, // 🔐 IMPORTANT
  }
  );

  showToast("success", res.data.message || "Order created");

  setOrderId("");
  setVideoLink("");
  setQuantity("");
  setSeconds("");

} catch (err) {

  showToast("error", "Server error");

} finally {

  setSingleLoading(false);

}
  };

  // =========================
  // MULTI ORDER API
  // =========================
  const handleMultiSubmit = async (e) => {
    e.preventDefault();
if (multiLoading) return;
    if (!multiText.trim()) {
      showToast("error", "Multi order data required");
      return;
    }

    const lines = multiText.trim().split("\n");

    const orders = [];

    for (let line of lines) {
      const [orderId, videoLink, quantity, seconds] =
        line.split(",");

      if (!orderId || !videoLink || !quantity || !seconds) {
        showToast("error", "Invalid multi order format");
        return;
      }

      orders.push({
        orderId: orderId.trim(),
        videoLink: videoLink.trim(),
        quantity: Number(quantity),
        seconds: Number(seconds),
      });
    }

    try {

  setMultiLoading(true);

  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/orders/multi-orders`,
    { orders },{
    withCredentials: true, // 🔐 IMPORTANT
  }
  );

  showToast("success", "Multi orders created");

  setMultiText("");

} catch (err) {

  showToast("error", "Multi order failed");

} finally {

  setMultiLoading(false);

}
  };

  return (
    <div className="order-page">

      {/* TOAST */}
      {toast.show && (
        <div className={`toast-box ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="order-card">

        <h2 className="order-title">📦 Add Order</h2>

        {/* TABS */}
        <div className="order-tabs">
          <button
            className={tab === "single" ? "active" : ""}
            onClick={() => setTab("single")}
          >
            Single Order
          </button>

          <button
            className={tab === "multi" ? "active" : ""}
            onClick={() => setTab("multi")}
          >
            Multi Order
          </button>
        </div>

        {/* SINGLE FORM */}
        {tab === "single" && (
          <form onSubmit={handleSingleSubmit} className="order-form">

            <input
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />

            <input
              placeholder="YouTube Link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />

            <input
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              placeholder="Seconds"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
            />

           <button
  type="submit"
  disabled={singleLoading}
>
  {singleLoading
    ? "Creating..."
    : "Create Order"}
</button>
          </form>
        )}

        {/* MULTI FORM */}
        {tab === "multi" && (
          <form onSubmit={handleMultiSubmit} className="order-form">

            <textarea
              placeholder={`Format:
orderId,videoLink,quantity,seconds
orderId,videoLink,quantity,seconds`}
              value={multiText}
              onChange={(e) => setMultiText(e.target.value)}
              rows={8}
            />

           <button
  type="submit"
  disabled={multiLoading}
>
  {multiLoading
    ? "Creating..."
    : "Create Multi Orders"}
</button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AddOrder;