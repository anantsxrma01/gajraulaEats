"use client";

import { useEffect, useState } from "react";
import ProtectedOwnerShell from "@/components/ProtectedOwnerShell";
import { fetchDeliveryPartners, updateDeliveryPartnerStatus, fetchDeliveryPartnerDetails, fetchDeliveryPartnerOrders } from "@/lib/apiAdminDelivery";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Bike, MapPin, Star, Clock, FileText, CheckCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

type Partner = {
  _id: string;
  user_id?: { name?: string; phone: string };
  vehicle_type: string;
  status: string;
  is_online: boolean;
  last_active_at?: string;
  total_trips?: number;
  rating?: number;
  createdAt?: string;
};

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [partnerOrders, setPartnerOrders] = useState<any[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDeliveryPartners({ status: statusFilter || undefined });
      setPartners(data.partners || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, status: string, name: string) => {
    try {
      await updateDeliveryPartnerStatus(id, status);
      toast.success(`${name} is now ${status}`);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const openDetails = async (id: string) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const [pDetails, ordersRes] = await Promise.all([
        fetchDeliveryPartnerDetails(id),
        fetchDeliveryPartnerOrders(id, 10),
      ]);
      setSelectedPartner(pDetails.partner);
      setPartnerOrders(ordersRes.orders || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load details");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedPartner(null);
    setPartnerOrders([]);
  };

  const statuses = ["", "PENDING", "ACTIVE", "INACTIVE", "BANNED"];

  return (
    <ProtectedOwnerShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-amber-500" />
            Delivery Fleet
          </h1>
          <p className="text-zinc-400 mt-1">Manage delivery riders, check statuses, and review active orders.</p>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
          {statuses.map((s) => (
            <button
              key={s || "ALL"}
              onClick={() => setStatusFilter(s)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === s ? "text-amber-500" : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {statusFilter === s && (
                <motion.div
                  layoutId="dp-status-tab"
                  className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{s || "All Partners"}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : partners.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bike className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Partners Found</h3>
            <p className="text-zinc-400">There are no riders matching this criteria.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {partners.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6 border border-white/5 relative group hover:border-amber-500/30 transition-colors"
                >
                  <div className="absolute top-4 right-4">
                    {p.is_online ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-zinc-600" /> OFFLINE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Bike className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{p.user_id?.name || "Unnamed"}</h3>
                      <p className="text-sm text-zinc-500 font-medium">{p.user_id?.phone || "No phone"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 mb-4 text-sm">
                    <div className="text-center">
                      <div className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">Rating</div>
                      <div className="text-white font-bold flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.rating != null ? p.rating.toFixed(1) : "N/A"}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">Trips</div>
                      <div className="text-white font-bold">{p.total_trips ?? 0}</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">Status</div>
                      <div className={`font-bold ${p.status === 'ACTIVE' ? 'text-emerald-400' : p.status === 'BANNED' ? 'text-red-400' : 'text-zinc-300'}`}>{p.status}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" className="w-full text-sm py-2" onClick={() => openDetails(p._id)}>
                      View Full Profile
                    </Button>
                    <div className="flex gap-2">
                      {p.status !== "ACTIVE" && (
                        <Button variant="primary" className="flex-1 text-xs px-2 py-2 shrink-0" onClick={() => handleStatusChange(p._id, "ACTIVE", p.user_id?.name || "Rider")}>
                          Activate
                        </Button>
                      )}
                      {p.status !== "INACTIVE" && (
                        <Button variant="secondary" className="flex-1 text-xs px-2 py-2 shrink-0" onClick={() => handleStatusChange(p._id, "INACTIVE", p.user_id?.name || "Rider")}>
                          Deactivate
                        </Button>
                      )}
                      {p.status !== "BANNED" && (
                        <Button variant="danger" className="text-xs px-3 py-2 shrink-0" onClick={() => handleStatusChange(p._id, "BANNED", p.user_id?.name || "Rider")}>
                          Ban
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {detailsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetails} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass relative w-full border border-white/10 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl">
                {detailsLoading ? (
                  <Loader />
                ) : selectedPartner && (
                   <>
                     <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                       <div>
                         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                           <Bike className="w-6 h-6 text-amber-500" />
                           {selectedPartner.user_id?.name || "Unnamed Profile"}
                         </h2>
                         <p className="text-zinc-400 text-sm mt-1">Vehicle: {selectedPartner.vehicle_type}</p>
                       </div>
                       <button onClick={closeDetails} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                         <XCircle className="w-6 h-6 text-zinc-400" />
                       </button>
                     </div>
                     
                     <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div className="glass p-4 rounded-2xl text-center">
                           <div className="text-zinc-500 text-xs font-semibold mb-1">Status</div>
                           <div className="text-white font-bold">{selectedPartner.status}</div>
                         </div>
                         <div className="glass p-4 rounded-2xl text-center">
                           <div className="text-zinc-500 text-xs font-semibold mb-1">State</div>
                           <div className={selectedPartner.is_online ? "text-emerald-400 font-bold" : "text-zinc-400 font-bold"}>{selectedPartner.is_online ? "ONLINE" : "OFFLINE"}</div>
                         </div>
                         <div className="glass p-4 rounded-2xl text-center">
                           <div className="text-zinc-500 text-xs font-semibold mb-1">Phone</div>
                           <div className="text-white font-bold text-sm truncate">{selectedPartner.user_id?.phone}</div>
                         </div>
                         <div className="glass p-4 rounded-2xl text-center">
                           <div className="text-zinc-500 text-xs font-semibold mb-1">Last Active</div>
                           <div className="text-white font-bold text-xs truncate">
                             {selectedPartner.last_active_at ? new Date(selectedPartner.last_active_at).toLocaleDateString() : "Never"}
                           </div>
                         </div>
                       </div>

                       <div>
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                           <FileText className="w-5 h-5 text-amber-500" /> Recent Trip History
                         </h3>
                         {partnerOrders.length === 0 ? (
                           <div className="glass p-8 text-center rounded-2xl text-zinc-500 text-sm border-dashed">
                             No order history found for this partner yet.
                           </div>
                         ) : (
                           <div className="space-y-3">
                             {partnerOrders.map((o) => (
                               <div key={o._id} className="glass p-4 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                                 <div>
                                   <div className="font-bold text-white mb-1 flex items-center gap-2">
                                     Order #{o.order_number?.slice(-6).toUpperCase() || "UNKNOWN"}
                                     <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">{o.order_status}</span>
                                   </div>
                                   <div className="text-sm text-zinc-400 flex items-center gap-2">
                                     <Store className="w-3 h-3" /> {o.shop_id?.name || "Unknown Shop"}
                                   </div>
                                   {o.address_id && (
                                     <div className="text-sm text-zinc-400 flex items-center gap-2 mt-0.5">
                                       <MapPin className="w-3 h-3" /> {o.address_id.line1}, {o.address_id.city}
                                     </div>
                                   )}
                                 </div>
                                 <div className="md:text-right shrink-0">
                                   <div className="text-amber-400 font-bold text-lg">₹{(o.total_amount || 0).toFixed(2)}</div>
                                   <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1 md:justify-end">
                                     <Clock className="w-3 h-3" /> {new Date(o.createdAt).toLocaleString()}
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>
                   </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedOwnerShell>
  );
}
