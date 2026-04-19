import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Shop {
  id: string;
  name: string;
  description: string;
  image?: string;
}

async function getShops() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-gateway-g6za.onrender.com"}/shops`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch shops");
  return res.json();
}

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Shops</h1>
        {shops.length === 0 ? (
          <p className="text-center text-muted-foreground">No shops available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {shops.map((shop: Shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`}>
                <div className="glass-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  {shop.image && <img src={shop.image} alt={shop.name} className="w-full h-32 object-cover rounded-lg mb-4" />}
                  <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
                  <p className="text-muted-foreground">{shop.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}