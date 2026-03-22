import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/client";

const STATUS_OPTIONS = [
  "PLACED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP",
  "ASSIGNED", "PICKED", "DELIVERED", "CANCELLED",
];

const statusClass = (s) => {
  const map = {
    PLACED: "status-placed", CONFIRMED: "status-confirmed",
    PREPARING: "status-preparing", READY_FOR_PICKUP: "status-ready",
    ASSIGNED: "status-ready", PICKED: "status-ready",
    DELIVERED: "status-delivered", CANCELLED: "status-cancelled",
  };
  return `status-badge ${map[s] || "status-delivered"}`;
};

const selectStyle = {
  padding: "8px 12px", borderRadius: 8, fontSize: 13,
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fafafa", outline: "none"
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [userPhone, setUserPhone] = useState(searchParams.get("user_phone") || "");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true); setError("");
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

  useEffect(() => { fetchOrders(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fafafa", marginBottom: 6 }}>Orders</h1>
        <p style={{ fontSize: 13, color: "#71717a" }}>View and manage all customer orders in real-time.</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleApplyFilters} style={{
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end",
        marginBottom: 20, padding: "16px 20px", borderRadius: 14,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 5, fontWeight: 500 }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 5, fontWeight: 500 }}>User Phone</label>
          <input
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Search by phone"
            style={selectStyle}
          />
        </div>
        <button type="submit" style={{
          padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: "rgba(139,92,246,0.15)", color: "#a78bfa",
          border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer"
        }}>
          Apply Filters
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13,
          background: "rgba(239,68,68,0.1)", color: "#f87171",
          border: "1px solid rgba(239,68,68,0.2)"
        }}>
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(139,92,246,0.2)",
            borderTopColor: "#8b5cf6", animation: "spin 0.8s linear infinite"
          }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px", borderRadius: 14,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
          color: "#52525b", fontSize: 14
        }}>
          No orders found.
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Order #", "User", "Shop", "Status", "Payment", "Created", "Rider"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 600, color: "#71717a",
                      textTransform: "uppercase", letterSpacing: "0.06em"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o._id} style={{
                    borderBottom: i < orders.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 0.15s"
                  }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <Link to={`/orders/${o._id}`} style={{
                        fontFamily: "monospace", fontSize: 13, color: "#a78bfa",
                        fontWeight: 600
                      }}>
                        #{o.order_number || o._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#d4d4d8" }}>{o.user_id?.phone ?? "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#d4d4d8" }}>{o.shop_id?.name ?? "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={statusClass(o.order_status)}>{o.order_status}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#71717a" }}>
                      {o.payment_mode} / {o.payment_status}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#71717a" }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#71717a" }}>
                      {o.delivery_partner_id ? o.delivery_partner_id._id.slice(-6).toUpperCase() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
