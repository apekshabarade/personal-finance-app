import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("pf_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("pf_token"));

  // 🔐 Attach token to axios
  useEffect(() => {
    if (token) {
      localStorage.setItem("pf_token", token);
    } else {
      localStorage.removeItem("pf_token");
    }
  }, [token]);
  

  // 👤 Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem("pf_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pf_user");
    }
  }, [user]);

  const login = (data) => {
    // backend must send { token, user }
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
