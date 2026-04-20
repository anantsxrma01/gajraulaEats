"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function ProtectedShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [shopName, setShopName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "shop_owner") {
      router.push("/not-allowed");
      return;
    }

    const check = async () => {
      try {
        const data = await api.get("/shops/my");
        if (data.shop?.name) setShopName(data.shop.name);
      } catch (e) {
        console.error(e);
        logout();
      } finally {
        setChecking(false);
      }
    };
    
    check();
  }, [user, loading, router, logout]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Double check user exists before rendering
  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-4 flex flex-col gap-4 bg-black/20">
        <div className="font-bold text-lg text-brand-400">{shopName || "My Shop"}</div>
        <nav className="flex flex-col gap-2 mt-4 text-sm">
          <a href="/dashboard" className="px-3 py-2 rounded hover:bg-white/5 transition-colors">Dashboard</a>
          <a href="/menu" className="px-3 py-2 rounded hover:bg-white/5 transition-colors">Menu</a>
          <a href="/orders" className="px-3 py-2 rounded hover:bg-white/5 transition-colors">Orders</a>
          <a href="/settings" className="px-3 py-2 rounded hover:bg-white/5 transition-colors">Settings</a>
        </nav>
        <button
          onClick={logout}
          className="mt-auto border border-red-500/30 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}