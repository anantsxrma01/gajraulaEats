import React from "react";
import { NavLink } from "react-router-dom";

const NAV = [
  {
    to: "/orders",
    label: "Orders",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: "/tickets",
    label: "Tickets",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="glass" style={{
      width: 220, flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(139,92,246,0.3)"
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.05em" }}>
            MGMT<span style={{ color: "#8b5cf6" }}>HUB</span>
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, marginBottom: 4,
              fontSize: 14, fontWeight: 500, transition: "all 0.2s",
              background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
              color: isActive ? "#a78bfa" : "#a1a1aa",
              border: `1px solid ${isActive ? "rgba(139,92,246,0.25)" : "transparent"}`,
            })}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer label */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 11, color: "#52525b" }}>
        Management Portal v1.0
      </div>
    </aside>
  );
}
