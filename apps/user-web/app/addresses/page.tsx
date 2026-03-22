"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { createAddress, getMyAddresses, setDefaultAddress } from "@/lib/addressApi";

type Address = {
  _id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  is_serviceable: boolean;
  distance_from_center_km: number;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState({
    label: "Home",
    line1: "",
    city: "Gajraula",
    state: "Uttar Pradesh",
    pincode: "",
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyAddresses();
      setAddresses(data.addresses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.line1 || !form.lat || !form.lng) return;
    await createAddress({
      ...form,
      lat: Number(form.lat),
      lng: Number(form.lng),
      is_default: addresses.length === 0,
    });
    setForm({
      label: "Home",
      line1: "",
      city: "Gajraula",
      state: "Uttar Pradesh",
      pincode: "",
      lat: "",
      lng: "",
    });
    load();
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id);
    load();
  };

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-4">My Addresses</h1>

      {/* add form */}
      <div className="border rounded-xl p-4 space-y-2 mb-6 bg-white text-sm">
        <div className="grid grid-cols-1 gap-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="Label (Home, Office)"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Line 1"
            value={form.line1}
            onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
          />
          <div className="flex gap-2">
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            />
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            />
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="border rounded px-3 py-1 text-sm"
        >
          Add Address
        </button>
      </div>

      {/* list */}
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="space-y-2">
          {addresses.map((a) => (
            <div
              key={a._id}
              className="border rounded-lg p-3 bg-white flex justify-between text-sm"
            >
              <div>
                <div className="font-medium">
                  {a.label}{" "}
                  {a.is_default && (
                    <span className="text-xs border rounded px-1 ml-1">
                      Default
                    </span>
                  )}
                </div>
                <div className="opacity-80">
                  {a.line1}, {a.city}, {a.state} {a.pincode}
                </div>
                <div className="text-xs opacity-70">
                  {a.is_serviceable
                    ? `Within service area (${a.distance_from_center_km} km)`
                    : "Outside service area"}
                </div>
              </div>
              {!a.is_default && (
                <button
                  className="text-xs border rounded px-2 h-fit"
                  onClick={() => handleSetDefault(a._id)}
                >
                  Make Default
                </button>
              )}
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="text-sm opacity-70">No addresses yet.</div>
          )}
        </div>
      )}
    </AppShell>
  );
}
