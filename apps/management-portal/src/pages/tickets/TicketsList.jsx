import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

const statusOptions = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/management/tickets", {
        params: { status },
      });
      setTickets(res.data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Tickets</h1>

      <div className="mb-3">
        <label className="block text-xs mb-1">Status</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading…</div>
      ) : tickets.length === 0 ? (
        <div className="text-sm text-gray-500">No tickets found.</div>
      ) : (
        <div className="border rounded bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Ticket</th>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Order</th>
                <th className="px-3 py-2 text-left">Priority</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Link
                      to={`/tickets/${t._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {t._id.slice(-6)}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{t.subject}</td>
                  <td className="px-3 py-2">{t.type}</td>
                  <td className="px-3 py-2">
                    {t.created_by_user_id?.phone || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {t.order_id?.order_number || t.order_id?._id?.slice(-6) || "-"}
                  </td>
                  <td className="px-3 py-2">{t.priority}</td>
                  <td className="px-3 py-2">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
