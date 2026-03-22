"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/apiClient";

export default function ProtectedShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [shopName, setShopName] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        // shop owner की shop fetch करके validate
        const data = await apiFetch("/shops/my");
        if (data.shop?.name) setShopName(data.shop.name);
      } catch (e) {
        console.error(e);
        logout();
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [logout]);

  if (loading || checking) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4 flex flex-col gap-4">
        <div className="font-bold text-lg">{shopName || "My Shop"}</div>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard">Dashboard</a>
          <a href="/menu">Menu</a>
          <a href="/orders">Orders</a>
          <a href="/settings">Settings</a>
        </nav>
        <button
          onClick={logout}
          className="mt-auto border px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}