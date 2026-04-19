import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

async function getMenu(shopId: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://backend-8qpa.onrender.com"
    }/api/menu/${shopId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch menu");
  }

  const data = await res.json();

  // adjust based on your API response
  return data.data || data;
}

export default async function ShopMenuPage({
  params,
}: {
  params: { shopId: string };
}) {
  const menu = await getMenu(params.shopId);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Menu</h1>

        {menu.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No menu items available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {menu.map((item: MenuItem) => (
              <div
                key={item._id}
                className="glass-card p-6 rounded-xl shadow-lg"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}

                <h2 className="text-xl font-semibold mb-2">
                  {item.name}
                </h2>

                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>

                <p className="text-lg font-bold text-primary">
                  ₹{item.price}
                </p>

                {/* TEMP BUTTON */}
                <button
                  className="mt-4 w-full bg-primary text-primary-foreground p-3 rounded-lg hover:opacity-90"
                  disabled
                >
                  Add to Cart (Coming Soon)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}