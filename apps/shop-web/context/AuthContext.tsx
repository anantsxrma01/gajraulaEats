"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getAuthToken } from "@/lib/apiClient";

type UserInfo = {
  id: string;
  phone: string;
  role: string;
} | null;

type AuthContextType = {
  user: UserInfo;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string) {
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = decodeJwt(token);
      if (decoded && decoded.id) {
        setUser({
          id: decoded.id,
          phone: decoded.phone || "",
          role: decoded.role || "",
        });
      } else {
        localStorage.removeItem("authToken");
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone: string, otp: string) => {
    const data = await api.post("/auth/verify-otp", { phone, otp });

    if (typeof window !== "undefined" && data.token) {
      localStorage.setItem("authToken", data.token);
      setUser({
        id: data.user.id,
        phone: data.user.phone,
        role: data.user.role,
      });
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}