import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaMoneyBillWave,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarDays,
  FaWallet,
  FaClock,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

import "./ViewPaymentManagement.css";

const ViewPaymentManagement = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/payment/view-payment-management`
      );

      setData(res.data);

    } catch (err) {

      setError(true);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  const LoadingCard = () => (
    <div className="payment-card-item loading-card">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

const totalPayments = Number(data?.completedPayments || 0);

const remaining =
  (Number(data?.adminBalance || 0)) - totalPayments;

const isCredit = remaining >= 0;
const absValue = Math.abs(remaining);



  return (
    <div className="payment-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

  <div className="header-left">
    <FaMoneyBillWave className="header-icon" />

    <div>
      <h2>Payment Management Overview</h2>
      <p>Track balances, payouts and requests</p>
    </div>
  </div>

  <button
    className="refresh-btn"
    onClick={fetchData}
    disabled={loading}
  >
    {loading ? "Loading..." : "Refresh"}
  </button>

</div>
      {/* CARDS */}
     <div className="payment-grid">

  {loading ? (

    [...Array(6)].map((_, index) => (
      <LoadingCard key={index} />
    ))

  ) : error ? (

    [...Array(6)].map((_, index) => (
      <div className="payment-card-item error-card" key={index}>
        <h3>Data Unavailable</h3>

        <p>
          Failed to load dashboard data
        </p>
      </div>
    ))

  ) : (

    <>

        {/* TODAY */}
        <div className="payment-card-item">

          <div className="card-top">

            <FaCalendarDay className="card-icon blue" />

            <span>Today Payments</span>

          </div>

          <h3>
            Rs. {formatAmount(data.todayPayments)}
          </h3>

          <p>Last 24 hours</p>

        </div>

        {/* WEEK */}
        <div className="payment-card-item">

          <div className="card-top">

            <FaCalendarWeek className="card-icon purple" />

            <span>Last 7 Days</span>

          </div>

          <h3>
            Rs. {formatAmount(data.weekPayments)}
          </h3>

          <p>Weekly Payments</p>

        </div>

        {/* MONTH */}
        <div className="payment-card-item">

          <div className="card-top">

           <FaCalendarDays className="card-icon indigo" />

            <span>Last 30 Days</span>

          </div>

          <h3>
            Rs. {formatAmount(data.monthPayments)}
          </h3>

          <p>Monthly Payments</p>

        </div>

        {/* ADMIN BALANCE */}
        <div className="payment-card-item">

          <div className="card-top">

            <FaWallet className="card-icon green" />

            <span>Admin Balance</span>

          </div>

          <h3>
            Rs. {formatAmount(data.adminBalance)}
          </h3>

          <p>Available Balance</p>

        </div>

        {/* PENDING */}
        <div className="payment-card-item">

          <div className="card-top">

            <FaClock className="card-icon orange" />

            <span>Pending Payments</span>

          </div>

          <h3>
            Rs. {formatAmount(data.pendingPayments)}
          </h3>

          <p>Total Requests</p>

        </div>

        {/* STATUS */}
        <div
          className={`payment-card-item ${
            isCredit
              ? "status-credit"
              : "status-debit"
          }`}
        >

          <div className="card-top">

            {isCredit ? (
              <FaArrowTrendUp className="card-icon" />
            ) : (
              <FaArrowTrendDown className="card-icon" />
            )}

            <span>Payment Status</span>

          </div>

          <h3>
            {isCredit ? "CREDIT" : "DEBIT"}
          </h3>

          <p>
  Rs. {formatAmount(absValue)}
</p>

        </div>
    </>

  )}

      </div>

    </div>
  );
};

export default ViewPaymentManagement;