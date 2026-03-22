"use client";

import { useEffect, useState } from "react";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import {
  getShops,
  approveShop,
  rejectShop,
  suspendShop,
} from "@/lib/apiAdmin";

export default function ShopApprovalPage() {
  const [shops, setShops] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getShops(statusFilter);
      setShops(data.shops);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    await approveShop(id);
    load();
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    await rejectShop(id, reason || "Rejected by admin");
    load();
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Are you sure you want to suspend this shop?")) return;
    await suspendShop(id);
    load();
  };

  return (
    <ProtectedOwnerShell>
      <h1 className="text-2xl font-bold mb-6">Shop Approval System</h1>

      {/* STATUS FILTER */}
      <div className="flex gap-2 mb-6">
        {["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded border text-sm ${
              statusFilter === s ? "bg-black text-white" : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {!loading && shops.length === 0 && (
        <p className="opacity-60 text-sm">No shops found.</p>
      )}

      {!loading && (
        <div className="space-y-4">
          {shops.map((shop: any) => (
            <div
              key={shop._id}
              className="border rounded-xl p-4 flex justify-between"
            >
              <div>
                <div className="font-semibold text-lg">{shop.name}</div>
                <div className="text-sm opacity-70">
                  Owner Phone: {shop.owner_user_id?.phone}
                </div>
                <div className="text-sm opacity-80 mt-1">
                  {shop.address?.line1}, {shop.address?.city}
                </div>

                {shop.rejection_reason && (
                  <div className="text-xs text-red-500 mt-1">
                    Rejected: {shop.rejection_reason}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 items-end">
                {shop.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleApprove(shop._id)}
                      className="border px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(shop._id)}
                      className="border px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

                {shop.status === "APPROVED" && (
                  <button
                    onClick={() => handleSuspend(shop._id)}
                    className="border px-3 py-1 rounded text-sm bg-red-100"
                  >
                    Suspend Shop
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedOwnerShell>
  );
}