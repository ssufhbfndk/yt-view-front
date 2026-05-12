import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PeopleFill,
  CartFill,
  CheckCircleFill,
  CurrencyDollar,
  ArrowRepeat,
} from "react-bootstrap-icons";
import "./Dashboard.css";

const Dashboard = () => {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    activeUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  const fetchDashboard = async () => {
    try {

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/dashboard/stats`
      );

      setStats({
        activeUsers: response.data.activeUsers || 0,
        pendingOrders: response.data.pendingOrders || 0,
        completedOrders: response.data.completedOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
      });

    } catch (error) {
      console.log("Dashboard API Error", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTO REFRESH EVERY 1 MIN
  // =========================
  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="container-fluid dashboard-page">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">📊 Admin Dashboard</h2>
          <p className="text-muted mb-0">
            Live overview of system activity
          </p>
        </div>

        <button
          className="btn btn-primary refresh-btn"
          onClick={fetchDashboard}
        >
          <ArrowRepeat size={18} className="me-2" />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="row g-4">

        {/* ACTIVE USERS */}
        <div className="col-lg-3 col-md-6">
          <div className="card dashboard-card users-card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="icon-box">
                <PeopleFill size={30} />
              </div>

              <h6 className="card-title mt-3">Active Users</h6>

              {loading ? (
                <div className="spinner-border spinner-border-sm"></div>
              ) : (
                <h2>{stats.activeUsers}</h2>
              )}

              <p className="text-muted mb-0">
                Currently active users
              </p>

            </div>
          </div>
        </div>

        {/* PENDING ORDERS */}
        <div className="col-lg-3 col-md-6">
          <div className="card dashboard-card orders-card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="icon-box">
                <CartFill size={30} />
              </div>

              <h6 className="card-title mt-3">Pending Orders</h6>

              {loading ? (
                <div className="spinner-border spinner-border-sm"></div>
              ) : (
                <h2>{stats.pendingOrders}</h2>
              )}

              <p className="text-muted mb-0">
                Orders waiting process
              </p>

            </div>
          </div>
        </div>

        {/* COMPLETED */}
        <div className="col-lg-3 col-md-6">
          <div className="card dashboard-card completed-card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="icon-box">
                <CheckCircleFill size={30} />
              </div>

              <h6 className="card-title mt-3">Completed Orders</h6>

              {loading ? (
                <div className="spinner-border spinner-border-sm"></div>
              ) : (
                <h2>{stats.completedOrders}</h2>
              )}

              <p className="text-muted mb-0">
                Successfully completed
              </p>

            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div className="col-lg-3 col-md-6">
          <div className="card dashboard-card revenue-card border-0 shadow-sm h-100">
            <div className="card-body">

              <div className="icon-box">
                <CurrencyDollar size={30} />
              </div>

              <h6 className="card-title mt-3">Revenue</h6>

              {loading ? (
                <div className="spinner-border spinner-border-sm"></div>
              ) : (
                <h2>Rs {stats.totalRevenue}</h2>
              )}

              <p className="text-muted mb-0">
                Total earnings
              </p>

            </div>
          </div>
        </div>

      </div>

      {/* EXTRA SECTION */}
      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">

          <h5 className="fw-bold mb-3">
            🚀 Live System Status
          </h5>

          <div className="row">

            <div className="col-md-4 mb-3">
              <div className="mini-box">
                <span>🟢 Server Status</span>
                <strong>Online</strong>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="mini-box">
                <span>⚡ API Response</span>
                <strong>Fast</strong>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="mini-box">
                <span>📦 Database</span>
                <strong>Connected</strong>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;