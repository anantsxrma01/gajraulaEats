import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/client";

const allStatuses = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "ASSIGNED",
  "PICKED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusOverride, setStatusOverride] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/management/orders/${id}`);
      setOrder(res.data.order);
      setStatusOverride(res.data.order.order_status);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleOverrideStatus = async () => {
    if (!statusOverride) return;
    setError("");
    try {
      await api.patch(`/management/orders/${id}/status`, {
        new_status: statusOverride,
        note,
      });
      await fetchOrder();
      setNote("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div>Loading…</div>;
  if (!order) return <div className="text-sm text-gray-500">Order not found.</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-500 mb-2"
      >
        ← Back to orders
      </button>

      <h1 className="text-lg font-semibold mb-2">
        Order {order.order_number || order._id}
      </h1>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-3 rounded border">
          <h2 className="text-sm font-semibold mb-2">Customer</h2>
          <p className="text-sm">Phone: {order.user_id?.phone}</p>
          <p className="text-sm">
            Address: {order.address_id?.line1}, {order.address_id?.city}
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <h2 className="text-sm font-semibold mb-2">Shop</h2>
          <p className="text-sm">{order.shop_id?.name}</p>
        </div>

        <div className="bg-white p-3 rounded border">
          <h2 className="text-sm font-semibold mb-2">Payment & Status</h2>
          <p className="text-sm">
            Status: <span className="font-medium">{order.order_status}</span>
          </p>
          <p className="text-sm">
            Payment: {order.payment_mode} / {order.payment_status}
          </p>
          <p className="text-sm">Amount: ₹{order.total_amount}</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded border mb-4">
        <h2 className="text-sm font-semibold mb-2">Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Item</th>
              <th className="text-left py-1">Qty</th>
              <th className="text-left py-1">Price</th>
              <th className="text-left py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-1">{it.name}</td>
                <td className="py-1">{it.qty}</td>
                <td className="py-1">₹{it.price}</td>
                <td className="py-1">₹{it.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple override section */}
      <div className="bg-white p-3 rounded border mb-4">
        <h2 className="text-sm font-semibold mb-2">Override Status</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={statusOverride}
            onChange={(e) => setStatusOverride(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-2 py-1 text-sm flex-1 min-w-[150px]"
            placeholder="Note (optional, e.g. reason)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={handleOverrideStatus}
            className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
