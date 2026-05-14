import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/custom-scrollbar.css";
import { AuthProvider } from "./context/AuthContext";
import { AdminProtectedRoute, UserProtectedRoute } from "./routes/ProtectedRoute";
import AdminLogin from "./com/admin panel/admin login/AdminLogin";
import Layout from "./com/admin panel/dashboard/Layout"; // Updated to use Layout
import UserLogin from "./com/user/UserLogin";
import UserProfile from "./com/user/UserProfile";
import ViewUser from "./com/admin panel/users/ViewUser";
import AddUser from "./com/admin panel/users/AddUser";
import ViewOrder from "./com/admin panel/orders/ViewOrder";
import AddOrder from "./com/admin panel/orders/AddOrder";
import ComOrder from "./com/admin panel/orders/ComOrder";
import AdminProfile from "./com/admin panel/dashboard/AdminProfile"; // Add UpdateProfile component
import Dashboard from "./com/admin panel/dashboard/Dashboard";
import Transactions from "./com/admin panel/paymnets/Transactions";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              {/* ✅ Nested Routes for Dashboard */}
              <Route index element={<Navigate to="dashboard" />} /> {/* Default route */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="view-user" element={<ViewUser />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="view-order" element={<ViewOrder />} />
              <Route path="add-order" element={<AddOrder />} />
              <Route path="complete-order" element={<ComOrder />} />
              <Route path="update-profile" element={<AdminProfile />} /> 
              <Route path="/transactions" element={<Transactions />} /> 
            </Route>
          </Route>

          {/* User Routes */}
          <Route path="/userlogin" element={<UserLogin />} />
          <Route element={<UserProtectedRoute />}>
            <Route path="/userprofile" element={<UserProfile />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/userlogin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;