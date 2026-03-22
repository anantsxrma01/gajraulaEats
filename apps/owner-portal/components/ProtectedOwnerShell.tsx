"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/apiClient";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    href: "/shops",
    label: "Shops",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
  },
  {
    href: "/delivery-partners",
    label: "Delivery Partners",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/payouts",
    label: "Payouts",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ProtectedOwnerShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const verifyOwner = async () => {
      try {
        if (!user) { window.location.href = "/login"; return; }
        if (user.role !== "OWNER") {
          setError("You are not allowed to access the Owner Portal.");
          logout(); return;
        }
        await apiFetch("/admin/shops?status=PENDING");
        setOwnerName(user.phone || "Owner");
      } catch (e: any) {
        setError("Session expired or unauthorized. Please login again.");
        logout();
      } finally {
        setChecking(false);
      }
    };
    if (!loading) verifyOwner();
  }, [loading, user, logout]);

  if (loading || checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid rgba(251,191,36,0.2)", borderTopColor: "#f59e0b",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>
        <button onClick={logout} style={{
          padding: "8px 18px", borderRadius: 8, fontSize: 13,
          background: "rgba(239,68,68,0.1)", color: "#f87171",
          border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer"
        }}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="glass-sidebar" style={{ width: 230, flexShrink: 0, display: "flex", flexDirection: "column" }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(251,191,36,0.35)"
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.04em" }}>
                OWNER<span style={{ color: "#f59e0b" }}>HUB</span>
              </div>
              <div style={{ fontSize: 11, color: "#71717a" }}>{ownerName}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                borderRadius: 10, marginBottom: 3, fontSize: 13, fontWeight: 500,
                textDecoration: "none", transition: "all 0.2s",
                background: isActive ? "rgba(251,191,36,0.12)" : "transparent",
                color: isActive ? "#fbbf24" : "#a1a1aa",
                border: `1px solid ${isActive ? "rgba(251,191,36,0.22)" : "transparent"}`,
              }}>
                {icon} {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={logout} style={{
            width: "100%", padding: "9px 14px", borderRadius: 10, fontSize: 13,
            fontWeight: 500, background: "rgba(239,68,68,0.07)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.18)", cursor: "pointer", transition: "background 0.2s"
          }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(9,9,11,0.8)", backdropFilter: "blur(20px)", flexShrink: 0
        }}>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa" }}>
            {NAV.find(n => pathname === n.href || pathname?.startsWith(n.href + "/"))?.label ?? "Owner Portal"}
          </h1>
          <div style={{
            padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: "rgba(251,191,36,0.1)", color: "#fbbf24",
            border: "1px solid rgba(251,191,36,0.2)"
          }}>
            OWNER
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
