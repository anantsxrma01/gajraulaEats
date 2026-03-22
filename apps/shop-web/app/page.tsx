"use client";

import { useState } from "react";

export default function ShopDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const TABS = ["Dashboard", "Orders", "Menu", "Earnings", "Settings"];

  const MOCK_ORDERS = [
    { id: "ORD-9921", item: "Chicken Biryani x2", total: "₹450", status: "Preparing", time: "10 mins ago" },
    { id: "ORD-9920", item: "Paneer Butter Masala", total: "₹280", status: "Ready", time: "25 mins ago" },
    { id: "ORD-9919", item: "Cold Coffee", total: "₹120", status: "Delivered", time: "1 hr ago" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-border/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.809c0-.626-.312-1.205-.826-1.537l-10.6-6.81a1.5 1.5 0 00-1.548 0l-10.6 6.81c-.514.332-.826.911-.826 1.537V21m15 0h-3.64" />
              </svg>
            </div>
            <h1 className="font-bold tracking-wider text-lg">SHOP<span className="text-brand-500">PANEL</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === tab 
                  ? "bg-brand-500/15 text-brand-400 shadow-[0_0_15px_rgba(16,185,129,0.05)] border border-brand-500/20" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors font-medium">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto hide-scroll">
        <header className="h-20 glass-panel border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-10 hidden md:flex">
          <h2 className="text-xl font-semibold">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-colors">
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 shadow-inner"></div>
              <div className="text-sm">
                <p className="font-medium text-white">Spicy Route</p>
                <p className="text-zinc-400 text-xs">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Today's Revenue", value: "₹4,250", icon: "₹", color: "from-brand-500/20 to-brand-600/5", border: "border-brand-500/20", text: "text-brand-400" },
              { label: "Active Orders", value: "12", icon: "📦", color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", text: "text-blue-400" },
              { label: "Total Menu Items", value: "48", icon: "🍔", color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20", text: "text-purple-400" },
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-2xl glass-panel bg-gradient-to-br ${stat.color} border ${stat.border} relative overflow-hidden group`}>
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                <p className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</p>
                <h3 className={`text-4xl font-bold ${stat.text}`}>{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Recent Orders Section */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold tracking-wide">Live Orders</h3>
              <button className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-zinc-500 border-b border-white/5">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_ORDERS.map((order, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-mono text-sm text-zinc-300">{order.id}</td>
                      <td className="py-4 text-sm font-medium">{order.item}</td>
                      <td className="py-4 text-sm text-zinc-300">{order.total}</td>
                      <td className="py-4 text-sm text-zinc-400">{order.time}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${order.status === 'Preparing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            order.status === 'Ready' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 
                            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="glass-button px-4 py-1.5 rounded-lg text-xs font-semibold">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
