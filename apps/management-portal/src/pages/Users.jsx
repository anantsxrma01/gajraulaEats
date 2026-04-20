import React, { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../api/usersApi";

const ROLES = ["CUSTOMER", "SHOP_OWNER", "DELIVERY_PARTNER", "MANAGER", "ADMIN"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data?.users || []);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(true);
    
    // Optimistic Update
    const prevUsers = [...users];
    setUsers((prev) => prev.map(u => (u._id === userId ? { ...u, role: newRole } : u)));

    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      console.error("Failed to update user role", err);
      alert("Failed to update user role.");
      setUsers(prevUsers); // Rollback
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-zinc-400">Manage platform users and assign operational roles.</p>
        </div>
        <button 
          onClick={fetchUsers} 
          disabled={loading || isUpdating}
          className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="glass border border-white/5 rounded-xl flex-1 overflow-hidden flex flex-col">
          {users.length === 0 ? (
            <div className="flex items-center justify-center p-12 flex-1 flex-col text-zinc-500">
               <span className="text-4xl mb-4">📭</span>
               <p>No users found in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                <thead>
                  <tr className="uppercase tracking-wider text-xs text-zinc-500 border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4 font-medium sticky top-0 bg-black/40">Name</th>
                    <th className="px-6 py-4 font-medium sticky top-0 bg-black/40">Phone / Details</th>
                    <th className="px-6 py-4 font-medium sticky top-0 bg-black/40">Current Role</th>
                    <th className="px-6 py-4 font-medium sticky top-0 bg-black/40 text-right">Assign Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{u.name || "N/A"}</td>
                      <td className="px-6 py-4 text-zinc-400">
                        {u.phone}
                        {u.email && <div className="text-xs opacity-70 mt-1">{u.email}</div>}
                      </td>
                      <td className="px-6 py-4">
                         <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs">
                           {u.role || "CUSTOMER"}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          className="bg-black border border-white/10 text-white rounded outline-none px-3 py-1.5 focus:border-brand-500 transition-colors disabled:opacity-50 text-sm"
                          value={u.role || "CUSTOMER"}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={isUpdating}
                        >
                          {ROLES.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
