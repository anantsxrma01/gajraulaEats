"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken, getAuthToken } from "@/lib/apiClient";

type AuthContextType = {
  user: any;
  login: (token: string, user: any) => void;
  logout: () => void;
};

// Basic JWT decode (optional)
function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded.user || { loggedIn: true });
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: any) => {
    setAuthToken(token);   // ✅ STORE TOKEN
    setUser(userData);     // ✅ STORE USER
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  if (loading) {
    return null; // Prevent UI flicker
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};