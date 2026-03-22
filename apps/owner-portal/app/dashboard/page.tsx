"use client";

import { useEffect, useState } from "react";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import {
  fetchOverview,
  fetchDaily,
  fetchTopShops,
  fetchTopItems
} from "@/lib/adminStatsApi";

type Overview = {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  activeShops: number;
  activeRiders: number;
  liveOrders: number;
  avgDeliveryTimeMinutes: number | null;
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [daily, setDaily] = useState<any[]>([]);
  const [topShops, setTopShops] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [ov, d, ts, ti] = await Promise.all([
        fetchOverview(),
        fetchDaily(7),
        fetchTopShops(5, 30),
        fetchTopItems(5, 30)
      ]);

      setOverview(ov);
      setDaily(d.stats || []);
      setTopShops(ts.stats || []);
      setTopItems(ti.stats || []);
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
    <ProtectedOwnerShell>
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      {loading && <div>Loading stats…</div>}

      {!loading && overview && (
        <div className="space-y-6">
          {/* KPI cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="Total Orders"
              value={overview.totalOrders}
              subtitle={`Today: ${overview.todayOrders}`}
            />
            <KpiCard
              title="Total Revenue"
              value={`₹ ${overview.totalRevenue.toFixed(0)}`}
              subtitle={`Today: ₹ ${overview.todayRevenue.toFixed(0)}`}
            />
            <KpiCard
              title="Active Shops & Riders"
              value={`${overview.activeShops} shops`}
              subtitle={`${overview.activeRiders} riders`}
            />
            <KpiCard
              title="Live Orders"
              value={overview.liveOrders}
              subtitle="Currently in progress"
            />
            <KpiCard
              title="Avg delivery time"
              value={
                overview.avgDeliveryTimeMinutes
                  ? `${overview.avgDeliveryTimeMinutes.toFixed(1)} min`
                  : "Not enough data"
              }
              subtitle="Last 7 days"
            />
          </section>

          {/* Daily chart */}
          <section className="border rounded-xl bg-white p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-sm">Last 7 days (Orders & Revenue)</h2>
            </div>
            <DailyChart data={daily} />
          </section>

          {/* Top shops + items */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-xl bg-white p-4">
              <h2 className="font-semibold text-sm mb-3">Top Shops (Last 30 days)</h2>
              <TopList
                data={topShops}
                labelKey="shop_name"
                valueKey="revenue"
                valuePrefix="₹"
              />
            </div>
            <div className="border rounded-xl bg-white p-4">
              <h2 className="font-semibold text-sm mb-3">Top Items (Last 30 days)</h2>
              <TopList
                data={topItems}
                labelKey="name"
                valueKey="qtySold"
                valuePrefix="×"
              />
            </div>
          </section>
        </div>
      )}
    </ProtectedOwnerShell>
  );
}

function KpiCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="border rounded-xl bg-white p-4 flex flex-col gap-1">
      <div className="text-xs uppercase tracking-wide opacity-60">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
      {subtitle && (
        <div className="text-xs opacity-70">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function DailyChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-xs opacity-60">No data.</div>;
  }

  const maxOrders = Math.max(...data.map((d) => d.orders || 0), 1);
  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 1);

  return (
    <div className="space-y-2 text-xs">
      {data.map((d, idx) => {
        const date = new Date(d.date);
        const orderWidth = `${(d.orders / maxOrders) * 100}%`;
        const revenueWidth = `${(d.revenue / maxRevenue) * 100}%`;
        return (
          <div key={idx}>
            <div className="flex justify-between mb-1">
              <span>
                {date.toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
              </span>
              <span>
                {d.orders} orders • ₹{d.revenue.toFixed(0)}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded overflow-hidden">
              <div
                className="h-3 bg-slate-500/70"
                style={{ width: orderWidth }}
                title="Orders"
              />
              <div
                className="h-1 bg-emerald-500/80 -mt-2"
                style={{ width: revenueWidth }}
                title="Revenue"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopList({
  data,
  labelKey,
  valueKey,
  valuePrefix
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  valuePrefix?: string;
}) {
  if (!data || data.length === 0) {
    return <div className="text-xs opacity-60">No data.</div>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {data.map((row, idx) => (
        <li
          key={idx}
          className="flex justify-between items-center border-b last:border-none pb-1"
        >
          <span className="flex-1">
            {idx + 1}. {row[labelKey] || "(Unnamed)"}
          </span>
          <span className="text-xs opacity-80">
            {valuePrefix}
            {row[valueKey]}
          </span>
        </li>
      ))}
    </ul>
  );
}