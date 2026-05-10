import React from "react";
import "./Dashboard.css"; // ✅ Link the CSS file

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <h2>📊 Dashboard</h2>
      <p>Welcome! Here you will find an overview of the system.</p>
      
      {/* Example Data Display (Replace with Actual Data) */}
      <div className="stats-container">
        <div className="stat-box">
          <h3>Users</h3>
          <p>50 Active Users</p>
        </div>
        <div className="stat-box">
          <h3>Orders</h3>
          <p>120 Pending Orders</p>
        </div>
        <div className="stat-box">
          <h3>Completed</h3>
          <p>500 Orders Completed</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
