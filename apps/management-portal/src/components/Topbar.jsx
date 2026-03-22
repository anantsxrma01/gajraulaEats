import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b">
      <div className="font-semibold">Management Portal</div>
      <div className="flex items-center gap-4 text-sm">
        <span>{user?.role} · {user?.phone}</span>
        <button
          onClick={logout}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
