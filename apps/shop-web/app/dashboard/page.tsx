"use client";

import ProtectedShell from "@/components/ProtectedShell";

export default function DashboardPage() {
  return (
    <ProtectedShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Shop Dashboard</h1>
        
        <div className="bg-black/20 border border-white/10 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-brand-400">Welcome to your Shop Panel</h2>
          <p className="text-zinc-400">
            Use the sidebar to manage your menu, track incoming orders, and configure your settings.
            <br />
            New features and statistics will be available soon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Placeholder cards for future metric expansion */}
          <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">📦</div>
             <div>
               <p className="text-zinc-500 text-sm">Today's Orders</p>
               <p className="text-2xl font-bold text-white">-</p>
             </div>
          </div>
          <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xl">₹</div>
             <div>
               <p className="text-zinc-500 text-sm">Today's Revenue</p>
               <p className="text-2xl font-bold text-white">-</p>
             </div>
          </div>
        </div>
      </div>
    </ProtectedShell>
  );
}