"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/ordersApi";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

interface Order {
  _id: string;
  items: any[];
  total_amount: number;
  order_status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || res); // adjust based on API
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          My Orders
        </h1>

        {loading && (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-center text-muted-foreground">
            No orders yet.
          </p>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <div
                key={order._id}
                className="glass-card p-6 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Order #{order._id}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.order_status === "DELIVERED"
                        ? "bg-green-500 text-white"
                        : order.order_status === "PENDING"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>

                <p className="text-muted-foreground mb-2">
                  Items: {order.items.length}
                </p>

                <p className="text-lg font-bold text-primary">
                  Total: ₹{order.total_amount}
                </p>

                <p className="text-sm text-muted-foreground">
                  Ordered on:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}