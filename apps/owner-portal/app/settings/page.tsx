"use client";

import { useEffect, useState } from "react";
import { fetchPlatformSettings, updatePlatformSettings } from "@/lib/settingsApi";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";

type Settings = {
  platform_center: { lat: number; lng: number };
  platform_radius_km: number;
  delivery_base_fee: number;
  delivery_base_distance_km: number;
  delivery_per_km_fee_after_base: number;
  default_shop_commission_percent: number;
  default_dp_per_km_rate: number;
  is_service_active: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPlatformSettings();
      setSettings(data.settings);
    } catch (e: any) {
      console.error(e);
      setMessage(e.message || "Error loading settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleField = (field: keyof Settings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleCenterField = (axis: "lat" | "lng", value: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      platform_center: {
        ...settings.platform_center,
        [axis]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      await updatePlatformSettings({
        platform_center: settings.platform_center,
        platform_radius_km: settings.platform_radius_km,
        delivery_base_fee: settings.delivery_base_fee,
        delivery_base_distance_km: settings.delivery_base_distance_km,
        delivery_per_km_fee_after_base: settings.delivery_per_km_fee_after_base,
        default_shop_commission_percent: settings.default_shop_commission_percent,
        default_dp_per_km_rate: settings.default_dp_per_km_rate,
        is_service_active: settings.is_service_active,
      });
      setMessage("Settings saved successfully.");
      await load();
    } catch (e: any) {
      setMessage(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedOwnerShell>
      <h1 className="text-2xl font-bold mb-4">Platform Settings</h1>

      {loading && <div>Loading...</div>}

      {!loading && settings && (
        <div className="space-y-6 max-w-xl text-sm">
          {/* Service toggle */}
          <div className="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Service Status</div>
              <div className="text-xs opacity-70">
                Turn off to temporarily stop all new orders.
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <span>{settings.is_service_active ? "Active" : "Paused"}</span>
              <input
                type="checkbox"
                checked={settings.is_service_active}
                onChange={(e) =>
                  handleField("is_service_active", e.target.checked)
                }
              />
            </label>
          </div>

          {/* Platform center + radius */}
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-medium">Service Area</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Center Latitude</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={settings.platform_center.lat}
                  onChange={(e) =>
                    handleCenterField("lat", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Center Longitude</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={settings.platform_center.lng}
                  onChange={(e) =>
                    handleCenterField("lng", Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Platform Radius (km)</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={settings.platform_radius_km}
                onChange={(e) =>
                  handleField("platform_radius_km", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Delivery charges */}
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-medium">Delivery Charges</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block mb-1">Base Fee (₹)</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={settings.delivery_base_fee}
                  onChange={(e) =>
                    handleField("delivery_base_fee", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Base Distance (km)</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={settings.delivery_base_distance_km}
                  onChange={(e) =>
                    handleField(
                      "delivery_base_distance_km",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Per km after base (₹)</label>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={settings.delivery_per_km_fee_after_base}
                  onChange={(e) =>
                    handleField(
                      "delivery_per_km_fee_after_base",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Commissions */}
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-medium">Commissions & Rates</div>
            <div>
              <label className="block mb-1">
                Default Shop Commission (% of order)
              </label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={settings.default_shop_commission_percent}
                onChange={(e) =>
                  handleField(
                    "default_shop_commission_percent",
                    Number(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <label className="block mb-1">
                Default DP Rate (₹ per km) <span className="opacity-60">(for payouts)</span>
              </label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={settings.default_dp_per_km_rate}
                onChange={(e) =>
                  handleField(
                    "default_dp_per_km_rate",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="border rounded px-4 py-2 text-sm"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

          {message && <p className="text-xs mt-2">{message}</p>}
        </div>
      )}
    </ProtectedOwnerShell>
  );
}