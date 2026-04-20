"use client";

import { useEffect, useState } from "react";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import { getShops, approveShop, rejectShop, suspendShop } from "@/lib/apiAdmin";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Store as StoreIcon, CheckCircle, XCircle, AlertTriangle, Phone, MapPin } from "lucide-react";
import type { Store } from "@/types/store";
import toast from "react-hot-toast";

export default function ShopApprovalPage() {
  const [shops, setShops] = useState<Store[]>([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getShops(statusFilter);
      setShops(data.shops || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load shops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleApprove = async (id: string, name: string) => {
    try {
      await approveShop(id);
      toast.success(`${name} approved successfully`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to approve shop");
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = prompt(`Enter rejection reason for ${name}:`);
    if (reason === null) return;
    try {
      await rejectShop(id, reason || "Rejected by admin");
      toast.success(`${name} rejected`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to reject shop");
    }
  };

  const handleSuspend = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to suspend ${name}?`)) return;
    try {
      await suspendShop(id);
      toast.success(`${name} suspended`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to suspend shop");
    }
  };

  const tabs = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

  return (
    <ProtectedOwnerShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <StoreIcon className="w-8 h-8 text-amber-500" />
            Shop Directory
          </h1>
          <p className="text-zinc-400 mt-1">Review onboarding applications and manage active restaurants.</p>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
          {tabs.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === s ? "text-amber-500" : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {statusFilter === s && (
                <motion.div
                  layoutId="shop-tab"
                  className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{s}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : shops.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <StoreIcon className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Shops Found</h3>
            <p className="text-zinc-400">There are no shops currently in the {statusFilter} state.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <AnimatePresence>
              {shops.map((shop: Store, i) => (
                <motion.div
                  key={shop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass flex-col justify-between rounded-2xl p-6 border border-white/5 group hover:border-amber-500/30 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">{shop.name}</h3>
                        {shop.is_open ? (
                          <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Accepting Orders</div>
                        ) : (
                          <div className="text-xs font-medium text-zinc-500 mt-1 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-600" /> Closed</div>
                        )}
                      </div>
                      <div className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg border ${
                        shop.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        shop.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        shop.status === 'SUSPENDED' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {shop.status}
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Phone className="w-4 h-4 text-zinc-500" />
                        {shop.owner_user_id?.phone || "No owner attached"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        <span className="truncate">{shop.address?.line1 || "No address"}, {shop.address?.city}</span>
                      </div>
                      {shop.rejection_reason && (
                        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                          <span className="font-bold block mb-1 text-red-500">Rejection Reason:</span>
                          {shop.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {shop.status === "PENDING" && (
                      <>
                        <Button variant="primary" className="flex-1 py-2.5 text-sm" onClick={() => handleApprove(shop._id, shop.name)}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button variant="danger" className="flex-1 py-2.5 text-sm" onClick={() => handleReject(shop._id, shop.name)}>
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </>
                    )}

                    {shop.status === "APPROVED" && (
                      <Button variant="danger" className="w-full py-2.5 text-sm" onClick={() => handleSuspend(shop._id, shop.name)}>
                        <AlertTriangle className="w-4 h-4 mr-2" /> Suspend Shop
                      </Button>
                    )}
                    
                    {shop.status === "SUSPENDED" && (
                      <Button variant="primary" className="w-full py-2.5 text-sm" onClick={() => handleApprove(shop._id, shop.name)}>
                        <CheckCircle className="w-4 h-4 mr-2" /> Unsuspend
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </ProtectedOwnerShell>
  );
}