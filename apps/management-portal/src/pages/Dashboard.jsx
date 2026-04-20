import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../api/statsApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        // Fallbacks for data structures
        setStats({
          users: data?.total_users || 0,
          shops: data?.total_shops || 0,
          orders: data?.total_orders || 0,
        });
      } catch (err) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg m-6">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h1>
        <p className="text-zinc-400">Overview of the platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
            👥
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Total Users</p>
            <h2 className="text-3xl font-bold text-white">{stats.users}</h2>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
            🏪
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Total Shops</p>
            <h2 className="text-3xl font-bold text-white">{stats.shops}</h2>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center text-xl">
            📦
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Total Orders</p>
            <h2 className="text-3xl font-bold text-white">{stats.orders}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
