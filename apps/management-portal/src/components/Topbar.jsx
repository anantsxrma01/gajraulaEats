import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="glass" style={{
      height: 64, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 24px",
      borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0
    }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#fafafa" }}>
        Management Dashboard
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)"
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0
            }}>
              {user.phone?.slice(-2) ?? "?"}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fafafa" }}>{user.role}</div>
              <div style={{ fontSize: 11, color: "#71717a" }}>{user.phone}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          style={{
            padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: "rgba(239,68,68,0.08)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)", transition: "background 0.2s"
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
