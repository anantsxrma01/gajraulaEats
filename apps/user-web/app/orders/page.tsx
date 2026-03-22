"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { fetchMyOrders } from "@/lib/userOrdersApi";

type OrderListItem = {
  _id: string;
  order_number: string;
  order_status: string;
  total_amount: number;
  createdAt: string;
  shop_id?: { name: string };
};

const statusColorClass: Record<string, string> = {
  PLACED: "border-yellow-500 text-yellow-700",
  CONFIRMED: "border-blue-500 text-blue-700",
  PREPARING: "border-blue-500 text-blue-700",
  READY_FOR_PICKUP: "border-purple-500 text-purple-700",
  ASSIGNED: "border-indigo-500 text-indigo-700",
  PICKED: "border-indigo-500 text-indigo-700",
  DELIVERED: "border-green-500 text-green-700",
  CANCELLED: "border-red-500 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchMyOrders();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {loading && <div>Loading...</div>}

      {!loading && orders.length === 0 && (
        <div className="text-sm opacity-70">
          You have no orders yet. Go to{" "}
          <Link href="/shops/nearby" className="underline">
            Nearby Shops
          </Link>{" "}
          and place your first order.
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-2">
          {orders.map((o) => {
            const statusClass =
              statusColorClass[o.order_status] || "border-gray-400 text-gray-700";

            return (
              <Link
                key={o._id}
                href={`/orders/${o._id}`}
                className="block border rounded-xl bg-white p-3 text-sm hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-medium">{o.order_number}</div>
                    <div className="text-xs opacity-70">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      {o.shop_id?.name ? `From: ${o.shop_id.name}` : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{o.total_amount}</div>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 rounded-full border text-xs ${statusClass}`}
                    >
                      {o.order_status}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
