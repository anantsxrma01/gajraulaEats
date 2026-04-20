"use client";

import { useEffect, useState } from "react";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import { fetchOverview, fetchDaily, fetchTopShops, fetchTopItems } from "@/lib/adminStatsApi";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Store, Activity, TrendingDown, Users, PackageOpen, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";

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
    } catch (e: any) {
      toast.error("Failed to load dashboard metrics.");
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-amber-500" />
              Platform Analytics
            </h1>
            <p className="text-zinc-400 mt-1">Real-time overview of your delivery marketplace.</p>
          </div>
          <button 
            onClick={load} 
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/5"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : overview ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-6"
          >
            {/* KPI metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Revenue"
                value={`₹ ${overview.totalRevenue.toFixed(0)}`}
                subtitle={`Today: ₹ ${overview.todayRevenue.toFixed(0)}`}
                icon={TrendingUp}
                trend="up"
                delay={0.1}
              />
              <MetricCard
                title="Total Orders"
                value={overview.totalOrders}
                subtitle={`Today: ${overview.todayOrders}`}
                icon={ShoppingBag}
                trend="up"
                delay={0.2}
              />
              <MetricCard
                title="Active Fleet"
                value={overview.activeShops}
                valueSuffix=" shops"
                subtitle={`${overview.activeRiders} active riders`}
                icon={Store}
                delay={0.3}
              />
              <MetricCard
                title="Live Operations"
                value={overview.liveOrders}
                valueSuffix=" orders"
                subtitle={`Avg ${overview.avgDeliveryTimeMinutes ? overview.avgDeliveryTimeMinutes.toFixed(1) : '-'}m ETA`}
                icon={Activity}
                trend={overview.liveOrders > 0 ? "up" : "neutral"}
                delay={0.4}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily chart placeholder for simple vertical rendering */}
              <Card delay={0.5} className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-lg text-white">7-Day Trajectory</h2>
                </div>
                <DailyChart data={daily} />
              </Card>

              {/* Top Shops */}
              <Card delay={0.6} className="lg:col-span-1">
                <h2 className="font-semibold text-lg text-white mb-6">Top Performing Shops</h2>
                <TopList data={topShops} labelKey="shop_name" valueKey="revenue" valuePrefix="₹" icon={Store} />
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Items */}
              <Card delay={0.7}>
                <h2 className="font-semibold text-lg text-white mb-6">Most Popular Items</h2>
                <TopList data={topItems} labelKey="name" valueKey="qtySold" valueSuffix=" sold" icon={PackageOpen} />
              </Card>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 text-zinc-500">No data available</div>
        )}
      </div>
    </ProtectedOwnerShell>
  );
}

function MetricCard({ title, value, valueSuffix, subtitle, icon: Icon, trend, delay = 0 }: any) {
  return (
    <Card delay={delay} className="flex flex-col gap-3 group hover:border-amber-500/20 transition-colors">
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium text-zinc-400">{title}</div>
        <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-zinc-400'} group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-white">
          {value}<span className="text-lg font-medium text-zinc-500 ml-1">{valueSuffix}</span>
        </div>
      </div>
      {subtitle && (
        <div className="text-sm text-zinc-500 font-medium">
          {subtitle}
        </div>
      )}
    </Card>
  );
}

function DailyChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="text-sm text-zinc-500 flex items-center justify-center py-10">No trajectory data to display.</div>;

  const maxOrders = Math.max(...data.map((d) => d.orders || 0), 1);
  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 1);

  return (
    <div className="space-y-4">
      {data.map((d, idx) => {
        const date = new Date(d.date);
        const revenueWidth = `${(d.revenue / maxRevenue) * 100}%`;
        return (
          <div key={idx} className="group cursor-default">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                {date.toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
              </span>
              <span className="text-sm text-zinc-500 group-hover:text-amber-500 transition-colors">
                {d.orders} orders <span className="mx-2 opacity-50">•</span> ₹{d.revenue.toFixed(0)}
              </span>
            </div>
            <div className="h-4 bg-black/50 border border-white/5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: revenueWidth }}
                transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                className="h-full bg-gradient-to-r from-amber-500/50 to-amber-500 relative"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopList({ data, labelKey, valueKey, valuePrefix = "", valueSuffix = "", icon: Icon }: any) {
  if (!data || data.length === 0) return <div className="text-sm text-zinc-500 py-10 text-center">Not enough data.</div>;

  return (
    <ul className="space-y-3">
      {data.map((row: any, idx: number) => (
        <li
          key={idx}
          className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
              <Icon className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-zinc-300 truncate">
              {idx + 1}. {row[labelKey] || "(Unnamed)"}
            </span>
          </div>
          <span className="text-sm font-bold text-white shrink-0 ml-4 group-hover:text-amber-400 transition-colors">
            {valuePrefix}{row[valueKey]}{valueSuffix}
          </span>
        </li>
      ))}
    </ul>
  );
}