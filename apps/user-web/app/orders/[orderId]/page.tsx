"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { fetchOrderDetail } from "@/lib/userOrdersApi";
import { createOrderEventSource } from "@/lib/streamClient";

type OrderDetail = {
  _id: string;
  order_number: string;
  order_status: string;
  payment_mode: string;
  payment_status: string;
  sub_total: number;
  delivery_charge: number;
  total_amount: number;
  distance_km: number;
  createdAt: string;
  timeline?: {
    placed_at?: string;
    confirmed_at?: string;
    preparing_at?: string;
    ready_at?: string;
    assigned_at?: string;
    picked_at?: string;
    delivered_at?: string;
    cancelled_at?: string;
  };
  shop_id?: {
    name: string;
  };
  address_id?: {
    label: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    item_id: string;
    name: string;
    price: number;
    qty: number;
    total_price: number;
    is_veg?: boolean;
  }[];
};

const ORDER_STEPS = [
  { key: "placed_at", label: "Placed" },
  { key: "confirmed_at", label: "Confirmed" },
  { key: "preparing_at", label: "Preparing" },
  { key: "ready_at", label: "Ready" },
  { key: "assigned_at", label: "Assigned" },
  { key: "picked_at", label: "Picked" },
  { key: "delivered_at", label: "Delivered" },
];

function formatTime(s?: string) {
  if (!s) return null;
  const d = new Date(s);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (!orderId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchOrderDetail(orderId);
        setOrder(data.order);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  // SSE subscription
  useEffect(() => {
    if (!orderId) return;
    const es = createOrderEventSource(orderId);
    if (!es) return;

    es.addEventListener("orderUpdate", (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "INIT" || payload.type === "ORDER_UPDATE") {
          setOrder(payload.order);
        }
      } catch (e) {
        console.error("SSE parse error:", e);
      }
    });

    es.onerror = (err) => {
      console.error("SSE error:", err);
      // EventSource auto-reconnect करेगा by default; चाहो तो es.close() भी कर सकते हो
    };

    return () => {
      es.close();
    };
  }, [orderId]);

  return (
    <AppShell>
      {loading && !order && <div>Loading...</div>}
      {!loading && !order && (
        <div className="text-sm opacity-70">Order not found.</div>
      )}

      {!loading && order && (
        <div className="space-y-4">
          {/* Header */}
          <div className="border rounded-xl bg-white p-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-xl font-bold mb-1">
                  Order #{order.order_number}
                </h1>
                <div className="text-xs opacity-70">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                {order.shop_id?.name && (
                  <div className="text-sm mt-1">
                    From: <span className="font-medium">{order.shop_id.name}</span>
                  </div>
                )}
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold text-lg">
                  ₹{order.total_amount}
                </div>
                <div className="text-xs opacity-80">
                  Subtotal: ₹{order.sub_total} + Delivery: ₹
                  {order.delivery_charge}
                </div>
                <div className="mt-1 text-xs">
                  {order.payment_mode} • {order.payment_status}
                </div>
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full border text-xs">
                  {order.order_status}
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="border rounded-xl bg-white p-4 text-sm">
            <h2 className="font-semibold mb-3">Status Timeline</h2>
            <div className="flex flex-col gap-2">
              {ORDER_STEPS.map((step) => {
                const time = formatTime(order.timeline?.[step.key as keyof typeof order.timeline]);
                const isDone = !!time;
                return (
                  <div key={step.key} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full border ${
                        isDone ? "bg-green-500 border-green-500" : "border-gray-300"
                      }`}
                    />
                    <div className="flex-1 flex justify-between">
                      <span
                        className={isDone ? "font-medium" : "opacity-60"}
                      >
                        {step.label}
                      </span>
                      <span className="text-xs opacity-70">
                        {time || "--"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery address */}
          {order.address_id && (
            <div className="border rounded-xl bg-white p-4 text-sm">
              <h2 className="font-semibold mb-2">Delivery Address</h2>
              <div className="font-medium">{order.address_id.label}</div>
              <div className="opacity-80">
                {order.address_id.line1}
                <br />
                {order.address_id.city}, {order.address_id.state}{" "}
                {order.address_id.pincode}
              </div>
              <div className="text-xs opacity-70 mt-1">
                Distance from shop: {order.distance_km.toFixed(1)} km
              </div>
            </div>
          )}

          {/* Items */}
          <div className="border rounded-xl bg-white p-4 text-sm">
            <h2 className="font-semibold mb-3">Items</h2>
            <div className="space-y-2">
              {order.items.map((it) => (
                <div
                  key={it.item_id + it.name}
                  className="flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {it.name}{" "}
                      <span className="text-xs opacity-70">× {it.qty}</span>
                    </div>
                    <div className="text-xs opacity-70">
                      ₹{it.price} each
                    </div>
                  </div>
                  <div className="font-medium">₹{it.total_price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}