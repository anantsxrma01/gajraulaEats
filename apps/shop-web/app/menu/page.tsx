"use client";

import { useEffect, useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import {
  fetchCategories,
  fetchItems,
  createCategory,
  createItem,
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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await createCategory({ name: newCatName });
    setNewCatName("");
    loadData();
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category_id) return;
    await createItem({
      name: newItem.name,
      price: Number(newItem.price),
      category_id: newItem.category_id,
      is_veg: newItem.is_veg,
    });
    setNewItem({ name: "", price: "", category_id: "", is_veg: true });
    loadData();
  };

  return (
    <ProtectedShell>
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

      {loading && <div>Loading...</div>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <section className="md:col-span-1 border rounded-xl p-4 space-y-3">
            <h2 className="font-semibold mb-2">Categories</h2>
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="New category name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button
                className="border rounded px-3 py-1 text-sm"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {categories.map((c) => (
                <li key={c._id} className="flex justify-between">
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Items */}
          <section className="md:col-span-2 border rounded-xl p-4 space-y-4">
            <h2 className="font-semibold">Items</h2>

            {/* Add Item Form */}
            <div className="border rounded-lg p-3 flex flex-wrap gap-2 items-center text-sm">
              <input
                className="border rounded px-2 py-1"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, name: e.target.value }))
                }
              />
              <input
                className="border rounded px-2 py-1 w-24"
                placeholder="Price"
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, price: e.target.value }))
                }
              />
              <select
                className="border rounded px-2 py-1"
                value={newItem.category_id}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, category_id: e.target.value }))
                }
              >
                <option value="">Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={newItem.is_veg}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, is_veg: e.target.checked }))
                  }
                />
                Veg
              </label>
              <button
                onClick={handleAddItem}
                className="border rounded px-3 py-1"
              >
                Add Item
              </button>
            </div>

            {/* Items list */}
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it._id}
                  className="border rounded-lg p-3 flex justify-between text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {it.name}{" "}
                      <span className="text-xs opacity-70">
                        (
                        {typeof it.category_id === "object"
                          ? it.category_id.name
                          : ""}
                        )
                      </span>
                    </div>
                    <div className="opacity-80">₹{it.price}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs">
                      {it.is_veg ? "VEG" : "NON-VEG"}
                    </span>
                    <span className="text-xs">
                      {it.in_stock && it.is_available ? "Available" : "Off"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </ProtectedShell>
  );
}
