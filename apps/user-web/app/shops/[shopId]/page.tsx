import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

async function getMenu(shopId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-gateway-g6za.onrender.com"}/menu/${shopId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch menu");
  }
  return res.json();
}

export default async function ShopMenuPage({ params }: { params: { shopId: string } }) {
  const menu = await getMenu(params.shopId);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Menu</h1>
        {menu.length === 0 ? (
          <p className="text-center text-muted-foreground">No menu items available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {menu.map((item: MenuItem) => (
              <div key={item.id} className="glass-card p-6 rounded-xl shadow-lg">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-4" />}
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <p className="text-lg font-bold text-primary">₹{item.price}</p>
                <button className="mt-4 w-full bg-primary text-primary-foreground p-3 rounded-lg hover:opacity-90">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
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
