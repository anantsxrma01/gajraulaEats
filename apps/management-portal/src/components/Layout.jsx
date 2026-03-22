import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
