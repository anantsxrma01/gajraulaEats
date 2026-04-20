"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import { apiFetch, clearAuthAndRedirect } from "@/lib/apiClient";

type UserInfo = {
  id: string;
  phone: string;
  role: string;
} | null;

type AuthContextType = {
  user: UserInfo;
  loading: boolean;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
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
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  };

  const saveToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  };

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

  const loginWithOtp = async (phone: string, otp: string) => {
    try {
      const res = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp })
      });

      if (!res.token || !res.user) {
        throw new Error("Invalid response from server");
      }

      saveToken(res.token);
      setUser({
        id: res.user.id || res.user._id,
        phone: res.user.phone,
        role: res.user.role
      });
    } catch (e) {
      console.error("Login error:", e);
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthAndRedirect();
  };

  const validateSession = () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const payload = decodeJwt(token);
    
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      logout();
    } else {
      setUser({
        id: payload.userId || payload.id,
        phone: payload.phone || "N/A",
        role: payload.role,
      });
    }
    setLoading(false);
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
