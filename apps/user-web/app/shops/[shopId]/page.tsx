import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import AddToCartButton from "@/components/AddToCartButton";

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

export default async function ShopMenuPage(
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;
  const menu = await getMenu(shopId);

  return (
    <ProtectedRoute>
      <AppShell>
        <SectionHeader
          title="Shop Menu"
          subtitle="Choose from the most delicious dishes available right now."
        />

        {menu.length === 0 ? (
          <EmptyState
            title="No menu items available"
            description="This restaurant has no dishes listed yet. Try another shop or come back later."
            actionLabel="Browse shops"
            actionHref="/shops"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {menu.map((item: MenuItem) => (
              <div
                key={item._id}
                className="glass-card rounded-xl p-6 shadow-lg hover:scale-[1.02] transition"
              >
                {item.image && (
                  <div className="mb-4 overflow-hidden rounded-3xl h-44 bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-2">{item.name}</h2>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-border/50">
                  <span className="font-bold tracking-tight text-foreground text-lg">₹{item.price}</span>
                  <AddToCartButton item={item} disabled={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}