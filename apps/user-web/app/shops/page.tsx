import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";

interface Shop {
  id: string;
  name: string;
  description: string;
  image?: string;
}

async function getShops() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-8qpa.onrender.com"}/shops`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch shops");
  return res.json();
}

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <ProtectedRoute>
      <AppShell>
        <SectionHeader
          title="Shops"
          subtitle="Browse restaurants and cloud kitchens around you."
        />

        {shops.length === 0 ? (
          <EmptyState
            title="No shops found"
            description="Check back later or try refreshing the page to discover nearby restaurants."
            actionLabel="Explore nearby"
            actionHref="/shops/nearby"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {shops.map((shop: Shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="group block glass-card rounded-xl p-6 shadow-lg transition hover:scale-[1.02] hover:shadow-2xl"
              >
                {shop.image && (
                  <div className="mb-4 overflow-hidden rounded-3xl h-44 bg-muted">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{shop.description}</p>
              </Link>
            ))}
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}