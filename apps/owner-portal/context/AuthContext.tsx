"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { apiFetch } from "@/lib/apiClient";

type UserInfo = {
  id: string;
  phone: string;
  role: string; // OWNER
} | null;

type AuthContextType = {
  user: UserInfo;
  loading: boolean;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  // Read token from localStorage
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  };

  // Save token
  const saveToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  };

  // Delete token
  const clearToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  };

  // Send OTP API
  const sendOtp = async (phone: string) => {
    try {
      await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone })
      });
    } catch (e) {
      console.error("Send OTP error:", e);
      throw e;
    }
  };

  // Verify OTP + login
  const loginWithOtp = async (phone: string, otp: string) => {
    try {
      const res = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp })
      });

      saveToken(res.token);

      setUser({
        id: res.user.id,
        phone: res.user.phone,
        role: res.user.role
      });
    } catch (e) {
      console.error("Login error:", e);
      throw e;
    }
  };

  // Logout
  const logout = () => {
    clearToken();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Validate token on page load
  const validateSession = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Hit an admin API to ensure token is valid & role is OWNER
      const res = await apiFetch("/admin/shops?status=PENDING");

      // Optional: You can build `/admin/me` endpoint later
      // For now, token valid -> use basic info from API if available

      // Example: store token user info manually (you can change it later)
      setUser({
        id: "owner",
        phone: "N/A",
        role: "OWNER"
      });
    } catch (e) {
      console.error("Session invalid:", e);
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithOtp,
        sendOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
