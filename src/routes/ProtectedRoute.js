import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLoader from "./../AppLoader";
export const AdminProtectedRoute = () => {
  const { admin, loading } = useAuth();

  if (loading) return <AppLoader />; // ✅ Ensure session is checked before rendering

  return admin ? <Outlet /> : <Navigate to="/adminlogin" replace />;
};

export const UserProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />; // ✅ Ensure session is checked before rendering

  return user ? <Outlet /> : <Navigate to="/userlogin" replace />;
};
