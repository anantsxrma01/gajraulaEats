import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { token, role, phone, name }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initial load पर token check
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("admin_role");
    const phone = localStorage.getItem("admin_phone");

    if (token && role) {
      setUser({ token, role, phone });
    }
    setLoading(false);
  }, []);

  const loginWithToken = (token, userInfo) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_role", userInfo.role);
    localStorage.setItem("admin_phone", userInfo.phone || "");

    setUser({
      token,
      role: userInfo.role,
      phone: userInfo.phone,
      name: userInfo.name,
    });
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_phone");
    setUser(null);
  };

  const value = { user, loading, loginWithToken, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
