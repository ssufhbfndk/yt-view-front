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
    let isMounted = true; // ✅ Prevent state update after unmount

    const checkSession = async () => {
      try {
        const responses = await Promise.allSettled([
          fetch(`${process.env.REACT_APP_API_URL}/admin/check-session`, { credentials: "include" }),
          fetch(`${process.env.REACT_APP_API_URL}/clientUser/check-session`, { credentials: "include" }),
        ]);

        const adminResponse = responses[0];
        const userResponse = responses[1];

        // ✅ Debugging: Log responses
        console.log("Admin Response:", adminResponse);
        console.log("User Response:", userResponse);

        if (adminResponse.status === "fulfilled" && adminResponse.value.ok) {
          const adminData = await adminResponse.value.json();
          if (adminData.success && isMounted) {
            setAdmin(adminData.admin);
            if (location.pathname === "/adminlogin") navigate("/dashboard");
          }
        } else {
          if (isMounted) setAdmin(null);
        }

        if (userResponse.status === "fulfilled" && userResponse.value.ok) {
          const userData = await userResponse.value.json();
          if (userData.success && isMounted) {
            setUser(userData.user);
            if (location.pathname === "/userlogin") navigate("/userprofile");
          }
        } else {
          if (isMounted) setUser(null);
        }
      } catch (error) {
        console.error("❌ Session check failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };


    checkSession();
  }, [location.pathname]); // ✅ Update session check when route changes

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
