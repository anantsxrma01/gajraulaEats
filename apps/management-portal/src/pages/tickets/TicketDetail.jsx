import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";

const statusOptions = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const priorityOptions = ["LOW", "MEDIUM", "HIGH"];

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const fetchTicket = async () => {
    setError("");
    try {
      const res = await api.get("/management/tickets", { params: { limit: 1 } });
      // ऊपर हमने single-ticket GET नहीं बनाया था; prod में: GET /management/tickets/:id use करना
      // फिलहाल मान लो कि अलग endpoint है:
      // const res = await api.get(`/management/tickets/${id}`);
      // For now you'll adjust later.
      // मैं सिर्फ structure दिखा रहा हूँ।
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ticket");
    }
  };

  useEffect(() => {
    // TODO: यहाँ proper single-ticket fetch implement करना
  }, [id]);

  const handleUpdate = async () => {
    setError("");
    try {
      await api.patch(`/management/tickets/${id}`, {
        status,
        priority,
        note,
      });
      setNote("");
      // Reload ticket…
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket");
    }
  };

  // अभी सिर्फ skeleton idea के लिए, तुम बाद में detail implement करोगे

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-gray-500 mb-2"
      >
        ← Back to tickets
      </button>
      <h1 className="text-lg font-semibold mb-2">Ticket {id}</h1>
      <p className="text-sm text-gray-500 mb-4">
        (Implement single-ticket fetch as described in backend)
      </p>

      <div className="flex flex-wrap gap-3 mb-3">
        <div>
          <label className="block text-xs mb-1">Status</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Priority</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityOptions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs mb-1">Internal note</label>
        <input
          className="border rounded px-2 py-1 text-sm w-full"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add internal note"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100"
      >
        Save changes
      </button>
    </div>
  );
}
