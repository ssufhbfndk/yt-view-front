import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/custom-scrollbar.css";
import { AuthProvider } from "./context/AuthContext";
import { AdminProtectedRoute } from "./routes/ProtectedRoute";
import AdminLogin from "./component/admin panel/admin login/AdminLogin";
import Layout from "./component/admin panel/dashboard/Layout";
import ViewUser from "./component/admin panel/users/ViewUser";
import AddUser from "./component/admin panel/users/AddUser";
import ViewOrder from "./component/admin panel/orders/ViewOrder";
import AddOrder from "./component/admin panel/orders/AddOrder";
import AdminProfile from "./component/admin panel/dashboard/AdminProfile";
import Dashboard from "./component/admin panel/dashboard/Dashboard";
import Transactions from "./component/admin panel/paymnets/Transactions";
import UpdatePaymentManagement from "./component/admin panel/paymnets/UpdatePaymentManagement";
import ViewPaymentManagement from "./component/admin panel/paymnets/ViewPaymentManagement";
import NotificationBroadcast from "./component/admin panel/notification/NotificationBroadcast";
import NotFound from "./component/NotFound";
import React from "react";

import PullToRefresh from "react-pull-to-refresh";

function App() {

  // 🔥 Pull to refresh action (full site reload)
  const handleRefresh = async () => {
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} style={{
    minHeight: "100vh",
    background: "#f5f5f5"
  }}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/adminlogin" element={<AdminLogin />} />

            <Route element={<AdminProtectedRoute />}>
              <Route path="/" element={<Layout />}>

                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="view-user" element={<ViewUser />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="view-order" element={<ViewOrder />} />
                <Route path="add-order" element={<AddOrder />} />
                <Route path="update-profile" element={<AdminProfile />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="notifications" element={<NotificationBroadcast />} />
                <Route path="update-payment-management" element={<UpdatePaymentManagement />} />
                <Route path="view-payment-management" element={<ViewPaymentManagement />} />
                <Route path="*" element={<NotFound />} />

              </Route>
            </Route>

          </Routes>
        </AuthProvider>
      </Router>
    </PullToRefresh>
  );
}

export default App;