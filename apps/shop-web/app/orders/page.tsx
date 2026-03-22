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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateOrderStatus(id, newStatus);
    load();
  };

  return (
    <ProtectedShell>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1 rounded border ${
              statusFilter === tab.key ? "bg-black text-white" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div>Loading...</div>}

      {!loading && (
        <div className="space-y-2">
          {orders.map((o) => (
            <div
              key={o._id}
              className="border rounded-lg p-3 flex justify-between items-center text-sm"
            >
              <div>
                <div className="font-medium">{o.order_number}</div>
                <div className="opacity-70 text-xs">
                  {new Date(o.createdAt).toLocaleString()} • ₹{o.total_amount}
                </div>
                {o.address_id && (
                  <div className="opacity-80 text-xs">
                    {o.address_id.line1}, {o.address_id.city}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs border rounded px-2 py-0.5">
                  {o.order_status}
                </span>
                <div className="flex gap-1">
                  {o.order_status === "PLACED" && (
                    <>
                      <button
                        className="border rounded px-2 py-0.5 text-xs"
                        onClick={() => handleStatusChange(o._id, "CONFIRMED")}
                      >
                        Confirm
                      </button>
                      <button
                        className="border rounded px-2 py-0.5 text-xs"
                        onClick={() =>
                          handleStatusChange(o._id, "CANCELLED")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {o.order_status === "CONFIRMED" && (
                    <button
                      className="border rounded px-2 py-0.5 text-xs"
                      onClick={() => handleStatusChange(o._id, "PREPARING")}
                    >
                      Start Preparing
                    </button>
                  )}
                  {o.order_status === "PREPARING" && (
                    <button
                      className="border rounded px-2 py-0.5 text-xs"
                      onClick={() =>
                        handleStatusChange(o._id, "READY_FOR_PICKUP")
                      }
                    >
                      Mark Ready
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-sm opacity-70">No orders for this filter.</div>
          )}
        </div>
      )}
    </ProtectedShell>
  );
}
