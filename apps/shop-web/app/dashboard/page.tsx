"use client";

import ProtectedShell from "@/components/ProtectedShell";

export default function DashboardPage() {
  return (
    <ProtectedShell>
      <h1 className="text-2xl font-bold mb-4">Shop Dashboard</h1>
      <p>Show quick stats here: today orders, revenue, etc.</p>
    </ProtectedShell>
  );
}