"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getAuthToken } from "@/lib/apiClient";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  // Optional: /auth/me endpoint हो तो बेहतर, अभी simple logic रखते हैं
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    // अभी के लिए सिर्फ token होने पर मान लेते हैं logged in,
    // आगे चलकर /shops/my call से validate करेंगे
    setLoading(false);
  }, []);

  const login = async (phone: string, otp: string) => {
    const data = await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data.token);
    }

    setUser({
      id: data.user.id,
      phone: data.user.phone,
      role: data.user.role,
    });
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
    setUser(null);
    window.location.href = "/login";
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