"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserInfo = {
  id?: string;
  phone: string;
  role: string;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
} | null;

export type ShopInfo = {
  _id?: string;
  id?: string;
  name?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | string;
  isActive?: boolean;
} | null;

type AuthContextType = {
  user: UserInfo;
  shop: ShopInfo;
  loading: boolean;
  /** Returns the redirect destination so the login page can navigate */
  sendOtp: (phone: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<string>;
  logout: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeGetItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

function clearAuthStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("shop");
  // Also clear old key name for backwards-compat
  localStorage.removeItem("authToken");
}

/** Determine where to redirect after login based on shop status */
function resolveRedirect(shop: ShopInfo): string {
  if (!shop) return "/not-allowed";
  if (shop.status !== "APPROVED") return "/not-allowed";
  return "/dashboard";
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo>(null);
  const [shop, setShop] = useState<ShopInfo>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = safeGetItem<UserInfo>("user");
    const storedShop = safeGetItem<ShopInfo>("shop");

    if (storedUser) setUser(storedUser);
    if (storedShop) setShop(storedShop);
    setLoading(false);
  }, []);

  const sendOtp = async (phone: string): Promise<void> => {
    await api.post("/auth/send-otp", { phone });
  };

  /**
   * Verifies OTP, persists auth state, and returns the route to navigate to.
   */
  const loginWithOtp = async (phone: string, otp: string): Promise<string> => {
    // Always declare this is a SHOP_OWNER login — backend uses this on first signup
    const data = await api.post("/auth/verify-otp", { phone, otp, role: "SHOP_OWNER" });

    if (!data.token) throw new Error("No token received from server.");

    const userData: UserInfo = {
      id: data.user?.id || data.user?._id,
      phone: data.user?.phone || phone,
      role: data.user?.role || "SHOP_OWNER",
    };

    const shopData: ShopInfo = data.shop
      ? {
          _id: data.shop._id || data.shop.id,
          name: data.shop.name,
          status: data.shop.status,
          isActive: data.shop.isActive,
        }
      : null;

    // Persist to localStorage
    safeSetItem("token", data.token);
    // Keep old key too for apiClient compatibility
    safeSetItem("authToken", data.token);
    safeSetItem("user", userData);
    safeSetItem("shop", shopData);

    // Update context state
    setUser(userData);
    setShop(shopData);

    return resolveRedirect(shopData);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setShop(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, shop, loading, sendOtp, loginWithOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}