import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const [adminResponse, userResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/admin/check-session`, {
            method: "GET",
            credentials: 'include',
          }),
          fetch(`${process.env.REACT_APP_API_URL}/clientUser/check-session`, {
            method: "GET",
            credentials: 'include',
          }),
        ]);
  
        const adminData = await adminResponse.json();
        const userData = await userResponse.json();
  
        console.log("🔍 Admin Session Response:", adminData); // Debugging
        console.log("🔍 User Session Response:", userData); // Debugging
  
        if (adminData.success) {
          setAdmin(adminData.admin);
          if (location.pathname === '/adminlogin') navigate('/dashboard');
        } else {
          setAdmin(null);
        }
  
        if (userData.success) {
          setUser(userData.user);
          if (location.pathname === '/userlogin') navigate('/userprofile');
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Session check failed', error);
      } finally {
        setLoading(false);
      }
    };
  
    checkSession();
  }, [location.pathname]);
  
  const adminLogin = (adminData) => {
    setAdmin(adminData);
    navigate("/dashboard");
  };

  const adminLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/admin/logout`, { method: "POST", credentials: "include" });
    setAdmin(null);
    navigate("/adminlogin");
  };

  const userLogin = (userData) => {
    setUser(userData);
    navigate("/userprofile");
  };

  const userLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/clientUser/logout`, { method: "POST", credentials: "include" });
    setUser(null);
    navigate("/userlogin");
  };

  if (loading) return <div>Loading...</div>; // ✅ Ensure session is checked before rendering

  return (
    <AuthContext.Provider value={{ admin, user, adminLogin, adminLogout, userLogin, userLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
