import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main style={{
          flex: 1, overflowY: "auto", padding: 28,
          background: "transparent"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
