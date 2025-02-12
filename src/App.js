import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/custom-scrollbar.css";
import { AuthProvider } from "./context/AuthContext";
import { AdminProtectedRoute, UserProtectedRoute } from "./routes/ProtectedRoute";
import AdminLogin from "./com/AdminLogin";
import Layout from "./com/admin profile/Layout"; // Updated to use Layout
import UserLogin from "./com/UserLogin";
import UserProfile from "./com/UserProfile";
import ViewUser from "./com/admin profile/ViewUser";
import AddUser from "./com/admin profile/AddUser";
import ViewOrder from "./com/admin profile/ViewOrder";
import AddOrder from "./com/admin profile/AddOrder";
import ComOrder from "./com/admin profile/ComOrder";
import UpdateProfile from "./com/admin profile/UpdateProfile"; // Add UpdateProfile component
import Dashboard from "./com/admin profile/Dashboard";


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
              <Route path="update-profile" element={<UpdateProfile />} /> {/* Update Profile route */}
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