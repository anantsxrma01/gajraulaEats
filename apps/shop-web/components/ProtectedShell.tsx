"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/settings", label: "Settings" },
];

export default function ProtectedShell({ children }: { children: ReactNode }) {
  const { user, shop, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || redirected.current) return;

    // Not logged in
    if (!user) {
      redirected.current = true;
      router.replace("/login");
      return;
    }

    // Wrong role — case-insensitive check
    const role = (user.role || "").toUpperCase();
    if (role !== "SHOP_OWNER") {
      redirected.current = true;
      router.replace("/not-allowed");
      return;
    }

    // Shop not found or not approved
    if (!shop || shop.status !== "APPROVED") {
      redirected.current = true;
      router.replace("/not-allowed");
      return;
    }
  }, [user, shop, loading, router]);

  // Show spinner while auth state is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <p className="text-zinc-500 text-sm">Authenticating…</p>
        </div>
      </div>
    );
  }

  // Don't render children until auth is confirmed
  if (!user || !shop || shop.status !== "APPROVED") return null;

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/5 p-5 flex flex-col gap-4 shrink-0"
             style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(24px)" }}>
        {/* Brand */}
        <div className="mb-2">
          <div className="text-emerald-400 font-bold text-base truncate">{shop.name || "My Shop"}</div>
          <div className="text-zinc-600 text-xs mt-0.5 truncate">{user.phone}</div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="border border-red-500/20 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl text-sm transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}