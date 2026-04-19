"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
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
      <SectionHeader
        title="Nearby Shops"
        subtitle="Find restaurants and kitchens close to your location."
        actionLabel="Browse all"
        actionHref="/shops"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : shops.length === 0 ? (
        <EmptyState
          title="No nearby shops yet"
          description="Try changing your address or expanding your delivery radius."
          actionLabel="View all shops"
          actionHref="/shops"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              href={`/shops/${shop._id}`}
              className="group block glass-card rounded-xl p-6 shadow-lg transition hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{shop.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {shop.tags?.join(", ")}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  shop.is_open ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                }`}>
                  {shop.is_open ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{shop.distance_km.toFixed(1)} km away</span>
                <span className="font-semibold text-foreground">View menu</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
