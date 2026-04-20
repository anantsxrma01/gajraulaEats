import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { token, role, phone, name, id }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const role = localStorage.getItem("admin_role");
      const phone = localStorage.getItem("admin_phone");
      const decoded = decodeJwt(token);

      if (decoded) {
        setUser({
          token,
          id: decoded.userId || decoded.id,
          role: role || decoded.role || "ADMIN", // fallbacks
          phone: phone || decoded.phone,
          name: decoded.name,
        });
      } else {
        localStorage.removeItem("admin_token");
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginWithToken = (token, userInfo) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_role", userInfo.role);
    localStorage.setItem("admin_phone", userInfo.phone || "");

    setUser({
      token,
      id: userInfo.id,
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
    window.location.href = "/login";
  };

  const value = { user, loading, loginWithToken, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
