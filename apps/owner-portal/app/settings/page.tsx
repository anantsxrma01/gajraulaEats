"use client";

import { useEffect, useState } from "react";
import { fetchPlatformSettings, updatePlatformSettings } from "@/lib/settingsApi";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, MapPin, Gauge, Percent, Power, Save } from "lucide-react";
import toast from "react-hot-toast";

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

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPlatformSettings();
      setSettings(data.settings);
    } catch (e: any) {
      toast.error(e.message || "Error loading settings");
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
      platform_center: { ...settings.platform_center, [axis]: value },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updatePlatformSettings(settings);
      toast.success("Platform settings saved successfully");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedOwnerShell>
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <SettingsIcon className="w-8 h-8 text-amber-500" />
              Platform Configuration
            </h1>
            <p className="text-zinc-400 mt-1">Configure global platform logic, boundaries, and financial rates.</p>
          </div>
          
          <Button onClick={handleSave} loading={saving} disabled={!settings} className="hidden lg:flex px-6">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        {loading ? (
          <Loader />
        ) : settings ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Kill Switch Toggle */}
            <div className={`glass border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${settings.is_service_active ? 'border-amber-500/30' : 'border-red-500/30'}`}>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Power className={settings.is_service_active ? "text-amber-500" : "text-red-500"} /> System Status
                </h3>
                <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                  {settings.is_service_active 
                    ? "The platform is currently operating normally and accepting new orders." 
                    : "The platform is PAUSED. Restaurants appear offline and users cannot place orders. Active ongoing orders are unaffected."}
                </p>
              </div>
              <button
                onClick={() => handleField("is_service_active", !settings.is_service_active)}
                className={`relative inline-flex h-10 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                  settings.is_service_active ? "bg-amber-500" : "bg-zinc-700"
                }`}
              >
                <span className="sr-only">Toggle Service</span>
                <span
                  className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.is_service_active ? "translate-x-5" : "-translate-x-5"
                  }`}
                />
              </button>
            </div>

            {/* Geographical Boundaries */}
            <div className="glass border border-white/10 rounded-3xl overflow-hidden">
              <div className="bg-white/5 p-4 border-b border-white/10">
                <h3 className="font-bold tracking-wide text-white flex items-center gap-2">
                  <MapPin className="text-amber-500 w-5 h-5" /> Geographical Boundaries
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Center Latitude"
                  type="number" step="any"
                  value={settings.platform_center.lat}
                  onChange={(e) => handleCenterField("lat", Number(e.target.value))}
                />
                <Input
                  label="Center Longitude"
                  type="number" step="any"
                  value={settings.platform_center.lng}
                  onChange={(e) => handleCenterField("lng", Number(e.target.value))}
                />
                <Input
                  label="Max Radius (km)"
                  type="number" step="any"
                  value={settings.platform_radius_km}
                  onChange={(e) => handleField("platform_radius_km", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Financial Calibration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass border border-white/10 rounded-3xl overflow-hidden">
                <div className="bg-white/5 p-4 border-b border-white/10">
                  <h3 className="font-bold tracking-wide text-white flex items-center gap-2">
                    <Gauge className="text-amber-500 w-5 h-5" /> Customer Fees
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <Input
                    label="Base Delivery Fee (₹)"
                    type="number" step="any" min="0"
                    value={settings.delivery_base_fee}
                    onChange={(e) => handleField("delivery_base_fee", Number(e.target.value))}
                  />
                  <Input
                    label="Base Distance Limit (km)"
                    type="number" step="any" min="0"
                    value={settings.delivery_base_distance_km}
                    onChange={(e) => handleField("delivery_base_distance_km", Number(e.target.value))}
                  />
                  <Input
                    label="Extra per km (₹) over base"
                    type="number" step="any" min="0"
                    value={settings.delivery_per_km_fee_after_base}
                    onChange={(e) => handleField("delivery_per_km_fee_after_base", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="glass border border-white/10 rounded-3xl overflow-hidden">
                <div className="bg-white/5 p-4 border-b border-white/10">
                  <h3 className="font-bold tracking-wide text-white flex items-center gap-2">
                    <Percent className="text-amber-500 w-5 h-5" /> Commissions & Payouts
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <Input
                    label="Default Shop Commission (%)"
                    type="number" step="any" min="0" max="100"
                    value={settings.default_shop_commission_percent}
                    onChange={(e) => handleField("default_shop_commission_percent", Number(e.target.value))}
                  />
                  <div className="text-xs text-zinc-500 -mt-2 mb-4">Platform cut on orders. Can be overridden per shop later.</div>
                  
                  <Input
                    label="Rider Rate (₹ per km)"
                    type="number" step="any" min="0"
                    value={settings.default_dp_per_km_rate}
                    onChange={(e) => handleField("default_dp_per_km_rate", Number(e.target.value))}
                  />
                  <div className="text-xs text-zinc-500 -mt-2">Amount paid to rider for distance covered.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 lg:hidden">
              <Button onClick={handleSave} loading={saving} disabled={!settings} className="w-full h-12 text-base">
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </Button>
            </div>
            
          </motion.div>
        ) : (
          <div className="text-center py-20 text-red-500">Failed to load platform configurations.</div>
        )}
      </div>
    </ProtectedOwnerShell>
  );
}