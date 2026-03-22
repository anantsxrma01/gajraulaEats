import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/client";

const statusOptions = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "ASSIGNED",
  "PICKED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [userPhone, setUserPhone] = useState(searchParams.get("user_phone") || "");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (status) params.status = status;
      if (userPhone) params.user_phone = userPhone;
      const res = await api.get("/management/orders", { params });
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (status) params.status = status;
    if (userPhone) params.user_phone = userPhone;
    setSearchParams(params);
    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Orders</h1>

      <form
        onSubmit={handleApplyFilters}
        className="mb-4 flex flex-wrap gap-3 items-end"
      >
        <div>
          <label className="block text-xs mb-1">Status</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">User phone</label>
          <input
            className="border rounded px-2 py-1 text-sm"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Search by phone"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100"
        >
          Apply
        </button>
      </form>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-500">No orders found.</div>
      ) : (
        <div className="border rounded bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Order #</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Shop</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Payment</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Rider</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Link
                      to={`/orders/${o._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {o.order_number || o._id.slice(-6)}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{o.user_id?.phone}</td>
                  <td className="px-3 py-2">{o.shop_id?.name}</td>
                  <td className="px-3 py-2">{o.order_status}</td>
                  <td className="px-3 py-2">
                    {o.payment_mode} / {o.payment_status}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    {o.delivery_partner_id ? o.delivery_partner_id._id.slice(-6) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
