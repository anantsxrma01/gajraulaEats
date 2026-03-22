import React from "react";
import { NavLink } from "react-router-dom";

const linkClass =
  "block px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors";

export default function Sidebar() {
  return (
    <aside className="w-56 border-r h-full p-3">
      <nav className="space-y-1">
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          Tickets
        </NavLink>
      </nav>
    </aside>
  );
}
