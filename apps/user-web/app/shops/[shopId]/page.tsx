"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getShopPublic, getShopMenu } from "@/lib/shopsApi";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  is_veg: boolean;
};

type MenuCategory = {
  category_id: string;
  category_name: string;
  items: MenuItem[];
};

export default function ShopPage() {
  const params = useParams();
  const shopId = params?.shopId as string;

  const [shop, setShop] = useState<any>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem, cart, totalItems, subTotal } = useCart();

  const load = async () => {
    setLoading(true);
    try {
      const [pub, men] = await Promise.all([
        getShopPublic(shopId),
        getShopMenu(shopId),
      ]);
      setShop(pub.shop);
      setMenu(men.menu || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) load();
  }, [shopId]);

  const handleAddToCart = (item: MenuItem) => {
    if (!shop) return;
    addItem(shop.id || shopId, shop.name, {
      itemId: item._id,
      name: item.name,
      price: item.price,
      isVeg: item.is_veg,
    });
  };

  return (
    <AppShell>
      {loading && <div>Loading...</div>}
      {!loading && shop && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{shop.name}</h1>
              <div className="text-xs opacity-70">
                {shop.is_open ? "Open" : "Closed"}
              </div>
            </div>

            {/* Cart mini summary */}
            {totalItems > 0 && cart.shopId === (shop.id || shopId) && (
              <Link
                href="/cart"
                className="border rounded-full px-3 py-1 text-xs bg-black text-white"
              >
                {totalItems} items • ₹{subTotal} → View Cart
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {menu.map((cat) => (
              <div key={cat.category_id} className="bg-white rounded-xl p-3">
                <h2 className="font-semibold mb-2">{cat.category_name}</h2>
                <div className="space-y-2 text-sm">
                  {cat.items.map((it) => (
                    <div
                      key={it._id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div>{it.name}</div>
                        <div className="text-xs opacity-70">
                          ₹{it.price} · {it.is_veg ? "Veg" : "Non-Veg"}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(it)}
                        className="border rounded-full px-3 py-1 text-xs"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                  {cat.items.length === 0 && (
                    <div className="text-xs opacity-60">
                      No items in this category yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
