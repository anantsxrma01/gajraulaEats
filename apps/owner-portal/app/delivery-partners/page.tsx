"use client";

import { useEffect, useState } from "react";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import {
  fetchDeliveryPartners,
  updateDeliveryPartnerStatus,
  fetchDeliveryPartnerDetails,
  fetchDeliveryPartnerOrders,
} from "@/lib/apiAdminDelivery";

type Partner = {
  _id: string;
  user_id?: { name?: string; phone: string };
  vehicle_type: string;
  status: string;
  is_online: boolean;
  last_active_at?: string;
  total_trips?: number;
  rating?: number;
  createdAt?: string;
};

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [onlineFilter, setOnlineFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [partnerOrders, setPartnerOrders] = useState<any[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDeliveryPartners({
        status: statusFilter || undefined,
        is_online: onlineFilter || undefined,
      });
      setPartners(data.partners || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter, onlineFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    await updateDeliveryPartnerStatus(id, status);
    load();
  };

  const openDetails = async (id: string) => {
    try {
      const [pDetails, ordersRes] = await Promise.all([
        fetchDeliveryPartnerDetails(id),
        fetchDeliveryPartnerOrders(id, 10),
      ]);
      setSelectedPartner(pDetails.partner);
      setPartnerOrders(ordersRes.orders || []);
      setDetailsOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedPartner(null);
    setPartnerOrders([]);
  };

  return (
    <ProtectedOwnerShell>
      <h1 className="text-2xl font-bold mb-6">Delivery Partners Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          {["", "PENDING", "ACTIVE", "INACTIVE", "BANNED"].map((s) => (
            <button
              key={s || "ALL"}
              className={`px-3 py-1 rounded border ${
                statusFilter === s ? "bg-black text-white" : ""
              }`}
              onClick={() => setStatusFilter(s)}
            >
              {s || "All"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Online:</span>
          {[
            { key: "", label: "All" },
            { key: "true", label: "Online" },
            { key: "false", label: "Offline" },
          ].map((o) => (
            <button
              key={o.key || "ALL"}
              className={`px-3 py-1 rounded border ${
                onlineFilter === o.key ? "bg-black text-white" : ""
              }`}
              onClick={() => setOnlineFilter(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table/List */}
      {loading && <div>Loading...</div>}

      {!loading && partners.length === 0 && (
        <div className="text-sm opacity-70">No delivery partners found.</div>
      )}

      {!loading && partners.length > 0 && (
        <div className="space-y-3">
          {partners.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl p-4 flex justify-between items-center text-sm"
            >
              <div>
                <div className="font-semibold">
                  {p.user_id?.name || "Unnamed Rider"}{" "}
                  <span className="opacity-70">({p.vehicle_type})</span>
                </div>
                <div className="opacity-80">
                  Phone: {p.user_id?.phone || "N/A"}
                </div>
                <div className="opacity-70 text-xs mt-1">
                  Status: {p.status} •{" "}
                  <span
                    className={
                      p.is_online ? "text-green-600" : "text-red-500"
                    }
                  >
                    {p.is_online ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
                <div className="opacity-70 text-xs">
                  Trips: {p.total_trips ?? 0} • Rating:{" "}
                  {p.rating != null ? p.rating.toFixed(1) : "N/A"}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => openDetails(p._id)}
                  className="px-3 py-1 border rounded text-xs"
                >
                  View Details
                </button>

                {/* Quick status actions */}
                <div className="flex gap-1">
                  {p.status !== "ACTIVE" && (
                    <button
                      onClick={() => handleStatusChange(p._id, "ACTIVE")}
                      className="px-2 py-1 border rounded text-xs"
                    >
                      Activate
                    </button>
                  )}
                  {p.status !== "INACTIVE" && (
                    <button
                      onClick={() => handleStatusChange(p._id, "INACTIVE")}
                      className="px-2 py-1 border rounded text-xs"
                    >
                      Set Inactive
                    </button>
                  )}
                  {p.status !== "BANNED" && (
                    <button
                      onClick={() => handleStatusChange(p._id, "BANNED")}
                      className="px-2 py-1 border rounded text-xs bg-red-100"
                    >
                      Ban
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details panel (simple overlay) */}
      {detailsOpen && selectedPartner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-lg text-sm space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">
                Rider Details – {selectedPartner.user_id?.name || "Unnamed"}
              </h2>
              <button
                onClick={closeDetails}
                className="text-xs px-2 py-1 border rounded"
              >
                Close
              </button>
            </div>

            <div>
              <div>Phone: {selectedPartner.user_id?.phone}</div>
              <div>Vehicle: {selectedPartner.vehicle_type}</div>
              <div>
                Status: {selectedPartner.status} •{" "}
                {selectedPartner.is_online ? "ONLINE" : "OFFLINE"}
              </div>
              <div>
                Trips: {selectedPartner.total_trips ?? 0} • Rating:{" "}
                {selectedPartner.rating != null
                  ? selectedPartner.rating.toFixed(1)
                  : "N/A"}
              </div>
              <div className="text-xs opacity-70">
                Last active:{" "}
                {selectedPartner.last_active_at
                  ? new Date(
                      selectedPartner.last_active_at
                    ).toLocaleString()
                  : "N/A"}
              </div>
            </div>

            <div className="border-t pt-3">
              <h3 className="font-semibold mb-2 text-sm">
                Recent Orders (last 10)
              </h3>
              {partnerOrders.length === 0 && (
                <div className="text-xs opacity-70">
                  No orders found for this partner.
                </div>
              )}
              <div className="space-y-1 max-h-48 overflow-auto">
                {partnerOrders.map((o) => (
                  <div key={o._id} className="border rounded p-2 text-xs">
                    <div className="font-medium">{o.order_number}</div>
                    <div className="opacity-70">
                      {o.shop_id?.name} → ₹{o.total_amount}
                    </div>
                    <div className="opacity-60">
                      {new Date(o.createdAt).toLocaleString()} –{" "}
                      {o.order_status}
                    </div>
                    {o.address_id && (
                      <div className="opacity-70">
                        {o.address_id.line1}, {o.address_id.city}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedOwnerShell>
  );
}
