import React, { useEffect, useState } from "react";
import { getShops, createShop, assignOwner } from "../api/shopsApi";
import { getUsers } from "../api/usersApi";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [users, setUsers] = useState([]); // for dropdown
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ name: "", address: "", ownerId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [shopsData, usersData] = await Promise.all([
        getShops(),
        getUsers().catch(() => ({ users: [] })) // Handle gracefully if missing
      ]);
      setShops(shopsData?.shops || []);
      // Limit to shop owners/admins for dropdown if possible
      setUsers(usersData?.users || []);
    } catch (err) {
      setError("Failed to load shops data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address) return;
    setIsSubmitting(true);

    try {
      // Create shop
      // Adjusting payload generically to cover backend limits.
      const shopRes = await createShop({
        name: form.name,
        line1: form.address,
        lat: 28.8386, // Gajraula mock fallback coords
        lng: 78.2345,
      });

      const newShopId = shopRes?.shop?._id || shopRes?.data?._id;

      // Assign owner if selected
      if (newShopId && form.ownerId) {
        await assignOwner(newShopId, form.ownerId);
      }

      setForm({ name: "", address: "", ownerId: "" });
      fetchData(); // reload
    } catch (err) {
      console.error("Create shop failed", err);
      alert(err.message || "Failed to create shop.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex justify-between items-end flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Shops</h1>
          <p className="text-zinc-400 mt-1">Manage platform restaurants and assign owners.</p>
        </div>
        <button 
          onClick={fetchData} 
          disabled={loading || isSubmitting}
          className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex-shrink-0">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Create Form */}
          <div className="glass border border-white/5 rounded-xl p-5 h-fit lg:sticky top-0">
            <h2 className="text-lg font-semibold text-white mb-4">Create New Shop</h2>
            <form onSubmit={handleCreateShop} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-400">Shop Name</label>
                <input
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="E.g. Spicy Route"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-400">Address (Line 1)</label>
                <input
                  required
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="123 Main Street"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-400">Assign Owner (Optional)</label>
                <select
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                  value={form.ownerId}
                  onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                >
                  <option value="">-- No Owner Assigned --</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name || u.phone} ({u.role})</option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors mt-2"
              >
                {isSubmitting ? "Creating..." : "Create Shop"}
              </button>
            </form>
          </div>

          {/* Shop List */}
          <div className="lg:col-span-2 glass border border-white/5 rounded-xl overflow-y-auto custom-scrollbar flex flex-col">
            {shops.length === 0 ? (
              <div className="flex items-center justify-center p-12 flex-1 flex-col text-zinc-500">
                <span className="text-4xl mb-4">🏬</span>
                <p>No shops registered yet.</p>
              </div>
            ) : (
                <div className="divide-y divide-white/5 p-2">
                  {shops.map(shop => (
                    <div key={shop._id} className="p-4 hover:bg-white/[0.02] transition-colors rounded-lg flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                          {shop.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            shop.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' : 
                            shop.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {shop.status}
                          </span>
                        </h3>
                        <p className="text-zinc-400 text-sm mt-1">
                          📍 {shop.address?.line1 || "No address provided"}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs font-medium">
                          <span className={`${shop.is_open ? 'text-brand-400' : 'text-zinc-500'}`}>
                            {shop.is_open ? `🟢 OPEN (${shop.open_time} - ${shop.close_time})` : "🔴 CLOSED"}
                          </span>
                          <span className="text-zinc-500 border border-white/10 px-2 py-0.5 rounded bg-black/20">
                            Commission: {shop.commission_percent || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">Owner</div>
                         <div className="text-sm bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                           <span className="text-xl">👤</span>
                           <span className={shop.owner_user_id ? "text-white" : "text-zinc-500 italic"}>
                             {shop.owner_user_id?.name || shop.owner_user_id?.phone || "Unassigned"}
                           </span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
