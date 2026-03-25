"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getAuthToken, setAuthToken } from "@/lib/apiClient";

type UserInfo = {
  id: string;
  phone: string;
  role: string;
} | null;

type AuthContextType = {
  user: UserInfo;
  loading: boolean;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Check expiry
      if (payload.exp * 1000 < Date.now()) {
        setAuthToken(null);
        setUser(null);
      } else {
        setUser({
          id: payload.userId,
          phone: payload.phone ?? "N/A",
          role: payload.role,
        });
      }
    } catch {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithOtp = async (phone: string, otp: string) => {
    const data = await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    setAuthToken(data.token);
    setUser({
      id: data.user.id,
      phone: data.user.phone,
      role: data.user.role,
    });
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
