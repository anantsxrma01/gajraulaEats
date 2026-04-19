"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/ordersApi";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader />
      </div>
    </ProtectedRoute>
  );
  if (error) return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex items-center justify-center text-red-500">
        {error}
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <div key={order.id} className="glass-card p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-500 text-white' :
                    order.status === 'pending' ? 'bg-yellow-500 text-black' :
                    'bg-gray-500 text-white'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">Items: {order.items.length}</p>
                <p className="text-lg font-bold text-primary">Total: ₹{order.total}</p>
                <p className="text-sm text-muted-foreground">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

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
