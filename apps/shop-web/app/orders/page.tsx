"use client";

import { useEffect, useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import { fetchShopOrders, updateOrderStatus } from "@/lib/ordersApi";

type Order = {
  _id: string;
  order_number: string;
  order_status: string;
  total_amount: number;
  createdAt: string;
  address_id?: { line1: string; city: string };
};

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "PLACED", label: "New" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY_FOR_PICKUP", label: "Ready" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchShopOrders(statusFilter || undefined);
      setOrders(data.orders || []);
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI Update
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, order_status: newStatus } : o))
    );

    try {
      await updateOrderStatus(id, newStatus);
    } catch (e) {
      console.error("Failed to update status", e);
      // Revert if API fails
      setOrders(previousOrders);
    }
  };

  return (
    <ProtectedShell>
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-bold text-white">Orders</h1>
         <button onClick={load} className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
         </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              statusFilter === tab.key 
                ? "bg-brand-500/20 text-brand-400 border-brand-500/30" 
                : "bg-black/20 text-zinc-400 border-white/5 hover:border-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-black/20 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:justify-between md:items-center text-sm gap-4 hover:border-white/20 transition-colors"
            >
              <div>
                <div className="font-semibold text-base text-white flex items-center gap-2">
                   {o.order_number}
                   <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                     o.order_status === 'PLACED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                     o.order_status === 'PREPARING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                     o.order_status === 'READY_FOR_PICKUP' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' :
                     o.order_status === 'DELIVERED' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                     'bg-red-500/10 text-red-400 border-red-500/20'
                   }`}>
                     {o.order_status}
                   </span>
                </div>
                <div className="opacity-70 text-xs mt-1">
                  {new Date(o.createdAt).toLocaleString()} • ₹{o.total_amount}
                </div>
                {o.address_id && (
                  <div className="opacity-80 text-xs mt-1 text-zinc-300">
                    <span className="opacity-50">Delivery to:</span> {o.address_id.line1}, {o.address_id.city}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {o.order_status === "PLACED" && (
                  <>
                    <button
                      className="bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                      onClick={() => handleStatusChange(o._id, "CONFIRMED")}
                    >
                      Confirm Order
                    </button>
                    <button
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium rounded-lg px-4 py-2 transition-colors"
                      onClick={() =>
                        handleStatusChange(o._id, "CANCELLED")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
                {o.order_status === "CONFIRMED" && (
                  <button
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/20 font-medium rounded-lg px-4 py-2 transition-colors"
                    onClick={() => handleStatusChange(o._id, "PREPARING")}
                  >
                    Start Preparing
                  </button>
                )}
                {o.order_status === "PREPARING" && (
                  <button
                    className="bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 border border-brand-500/20 font-medium rounded-lg px-4 py-2 transition-colors"
                    onClick={() =>
                      handleStatusChange(o._id, "READY_FOR_PICKUP")
                    }
                  >
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center p-12 border border-white/5 border-dashed rounded-xl">
               <div className="text-4xl mb-3 opacity-20">📭</div>
               <p className="text-zinc-500 font-medium">No orders found for this filter.</p>
            </div>
          )}
        </div>
      )}
    </ProtectedShell>
  );
}
