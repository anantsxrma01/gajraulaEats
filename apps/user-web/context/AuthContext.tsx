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
    // simple approach: if token exists, just consider logged in.
    // advance me backend /auth/me add kar sakte ho.
    setLoading(false);
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
