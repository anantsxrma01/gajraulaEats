"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { getNearbyShops } from "@/lib/shopsApi";

type Shop = {
  _id: string;
  name: string;
  tags?: string[];
  distance_km: number;
  is_open: boolean;
};

export default function NearbyShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNearbyShops();
      setShops(data.shops || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-4">Nearby Shops</h1>
      {loading && <div>Loading...</div>}

      {!loading && (
        <div className="space-y-2">
          {shops.map((s) => (
            <Link
              key={s._id}
              href={`/shops/${s._id}`}
              className="block border rounded-xl bg-white p-3 text-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs opacity-70">
                    {s.tags?.join(", ")}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>{s.distance_km.toFixed(1)} km</div>
                  <div
                    className={`mt-1 px-2 py-0.5 rounded-full border ${
                      s.is_open ? "border-green-500" : "border-red-400"
                    }`}
                  >
                    {s.is_open ? "Open" : "Closed"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {shops.length === 0 && !loading && (
            <div className="text-sm opacity-70">
              No shops nearby. Check your address or radius.
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
