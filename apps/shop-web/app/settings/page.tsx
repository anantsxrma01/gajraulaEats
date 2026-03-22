"use client";

import { useEffect, useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import { apiFetch } from "@/lib/apiClient";

export default function SettingsPage() {
  const [shop, setShop] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await apiFetch("/shops/my");
    setShop(data.shop);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field: string, value: any) => {
    setShop((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch("/shop-owner/shop", {
        method: "PATCH",
        body: JSON.stringify({
          name: shop.name,
          open_time: shop.open_time,
          close_time: shop.close_time,
          is_open: shop.is_open,
          service_radius_km: shop.service_radius_km,
          tags: shop.tags,
        }),
      });
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!shop) {
    return (
      <ProtectedShell>
        <div>Loading...</div>
      </ProtectedShell>
    );
  }

  return (
    <ProtectedShell>
      <h1 className="text-2xl font-bold mb-4">Shop Settings</h1>

      <div className="space-y-3 max-w-md text-sm">
        <div>
          <label className="block mb-1">Shop Name</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={shop.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1">Open Time (HH:mm)</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={shop.open_time || ""}
              onChange={(e) => handleChange("open_time", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Close Time</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={shop.close_time || ""}
              onChange={(e) => handleChange("close_time", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Service Radius (km)</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full"
            value={shop.service_radius_km || ""}
            onChange={(e) =>
              handleChange("service_radius_km", Number(e.target.value))
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <label>Open?</label>
          <input
            type="checkbox"
            checked={shop.is_open}
            onChange={(e) => handleChange("is_open", e.target.checked)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border rounded px-4 py-2 mt-2"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </ProtectedShell>
  );
}
