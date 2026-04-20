"use client";

import { useEffect, useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import {
  fetchCategories,
  fetchItems,
  createCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/menuApi";

type Category = {
  _id: string;
  name: string;
  sort_order: number;
};

type Item = {
  _id: string;
  name: string;
  price: number;
  is_veg: boolean;
  in_stock: boolean;
  is_available: boolean;
  category_id: { _id: string; name: string } | string;
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCatName, setNewCatName] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category_id: "",
    is_veg: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, itemRes] = await Promise.all([fetchCategories(), fetchItems()]);
      setCategories(catRes.categories || []);
      setItems(itemRes.items || []);
    } catch (e) {
      console.error("Failed to load menu", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await createCategory({ name: newCatName });
      setNewCatName("");
      loadData();
    } catch (e) {
      console.error("Failed to create category", e);
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      loadData();
    } catch (e) {
      console.error("Failed to delete category", e);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category_id) return;
    try {
      await createItem({
        name: newItem.name,
        price: Number(newItem.price),
        category_id: newItem.category_id,
        is_veg: newItem.is_veg,
      });
      setNewItem({ name: "", price: "", category_id: "", is_veg: true });
      loadData();
    } catch (e) {
      console.error("Failed to add item", e);
    }
  };

  const handleToggleAvailability = async (id: string, currentAvail: boolean) => {
    // Optimistic Update
    const prevItems = [...items];
    setItems((prev) => prev.map((it) => (it._id === id ? { ...it, is_available: !currentAvail } : it)));
    try {
      await updateItem(id, { is_available: !currentAvail });
    } catch (e) {
      console.error("Failed to update item", e);
      setItems(prevItems);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id);
      loadData();
    } catch (e) {
      console.error("Failed to delete item", e);
    }
  };

  return (
    <ProtectedShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Menu Management</h1>
        <button onClick={loadData} className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <section className="md:col-span-1 bg-black/20 border border-white/10 rounded-xl p-4 space-y-4 h-fit sticky top-6">
            <h2 className="font-semibold text-lg text-white">Categories</h2>
            <div className="flex gap-2">
              <input
                className="bg-black border border-white/10 rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="New category"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button
                className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
            
            {categories.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4 border border-dashed border-white/10 rounded-lg">No categories yet</p>
            ) : (
              <ul className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {categories.map((c) => (
                  <li key={c._id} className="flex justify-between items-center group bg-white/5 border border-white/5 p-2 rounded-lg text-sm">
                    <span className="truncate pr-2">{c.name}</span>
                    <button 
                      onClick={() => handleDeleteCategory(c._id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      title="Delete category"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Items */}
          <section className="md:col-span-2 space-y-6">
            <h2 className="font-semibold text-lg text-white">Menu Items</h2>

            {/* Add Item Form */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-brand-400 uppercase tracking-wider">Add New Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <input
                  className="bg-black border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <input
                  className="bg-black border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="Price (₹)"
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, price: e.target.value }))
                  }
                />
                <select
                  className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                  value={newItem.category_id}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, category_id: e.target.value }))
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 py-2 px-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors flex-1">
                    <input
                      type="checkbox"
                      checked={newItem.is_veg}
                      onChange={(e) =>
                        setNewItem((p) => ({ ...p, is_veg: e.target.checked }))
                      }
                      className="accent-brand-500 w-4 h-4"
                    />
                    Veg
                  </label>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.name || !newItem.price || !newItem.category_id}
                    className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 text-white font-medium rounded-lg px-4 py-2 flex-1 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Items list */}
            {items.length === 0 ? (
               <div className="text-center p-12 border border-white/10 border-dashed rounded-xl">
                 <p className="text-zinc-500 font-medium">No items in the menu.</p>
               </div>
            ) : (
              <div className="space-y-3">
                {items.map((it) => (
                  <div
                    key={it._id}
                    className="bg-black/20 border border-white/10 rounded-xl p-4 flex justify-between items-center text-sm gap-4 hover:border-white/20 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-base text-white flex items-center gap-3">
                        {it.name}
                        <span className={`w-3 h-3 rounded-sm flex items-center justify-center border ${it.is_veg ? 'border-green-500' : 'border-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${it.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                      </div>
                      <div className="opacity-70 mt-1 flex items-center gap-3">
                        <span className="text-white font-medium">₹{it.price}</span>
                        <span className="text-zinc-500">•</span>
                        <span>
                          {typeof it.category_id === "object"
                            ? it.category_id.name
                            : "No Category"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleAvailability(it._id, it.is_available)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          it.is_available 
                           ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" 
                           : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {it.is_available ? "Available" : "Unavailable"}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(it._id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors border border-transparent hover:border-red-500/20"
                        title="Delete Item"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </ProtectedShell>
  );
}
