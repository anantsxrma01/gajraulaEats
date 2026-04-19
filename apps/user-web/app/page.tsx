"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RestaurantCard from "@/components/RestaurantCard";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import { getNearbyShops } from "@/lib/shopsApi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// Fallback Mock Data in case backend is down or empty
const FALLBACK_RESTAURANTS = [
  {
    id: "r1",
    name: "Spicy Route",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    rating: 4.8,
    tags: ["North Indian", "Mughlai", "Biryani"],
    deliveryTime: "25-30 min",
    deliveryFee: "₹40"
  },
  {
    id: "r2",
    name: "Burger & Brews",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80",
    rating: 4.5,
    tags: ["Fast Food", "American", "Beverages"],
    deliveryTime: "15-20 min",
    deliveryFee: "Free Delivery"
  },
  {
    id: "r3",
    name: "Sushi Sensation",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    rating: 4.9,
    tags: ["Japanese", "Sushi", "Asian"],
    deliveryTime: "30-40 min",
    deliveryFee: "₹60"
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getNearbyShops();
        const shopsList = data.shops || [];
        
        if (shopsList.length > 0) {
          // Map backend shop structure to our UI component props
          const formattedShops = shopsList.map((shop: any) => ({
             id: shop._id || shop.id,
             name: shop.name || "Unknown Restaurant",
             image: shop.image_url || shop.cover_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
             rating: shop.rating || 4.5,
             tags: shop.tags || shop.cuisines || ["Various"],
             deliveryTime: shop.delivery_time || "30-45 min",
             deliveryFee: shop.delivery_fee ? `₹${shop.delivery_fee}` : "Free Delivery"
          }));
          setRestaurants(formattedShops);
        } else {
          setRestaurants(FALLBACK_RESTAURANTS);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        setRestaurants(FALLBACK_RESTAURANTS);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24">
        <HeroSection />

        <section className="container mx-auto px-4 max-w-6xl py-12">
          <SectionHeader
            title="Featured Restaurants"
            subtitle="Discover top-rated restaurants and fast delivery options near you."
            actionLabel="Browse all"
            actionHref="/shops"
          />

          {loading ? (
            <div className="py-10">
              <Loader count={6} />
            </div>
          ) : restaurants.length === 0 ? (
            <EmptyState
              title="No restaurants available"
              description="Try updating your location or searching for another cuisine to find more options."
              actionLabel="Explore nearby"
              actionHref="/shops"
            />
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {restaurants.map((restaurant: any) => (
                <motion.div key={restaurant.id} variants={itemVariants}>
                  <RestaurantCard
                    id={restaurant.id}
                    name={restaurant.name}
                    image={restaurant.image}
                    rating={restaurant.rating}
                    tags={restaurant.tags}
                    deliveryTime={restaurant.deliveryTime}
                    deliveryFee={restaurant.deliveryFee}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <section className="bg-card border-t border-border py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHeader
              title="Popular Cuisines"
              subtitle="Browse by food categories that match your cravings."
            />

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "North Indian",
                "South Indian",
                "Chinese",
                "Italian",
                "Healthy",
                "Desserts",
                "Beverages",
                "Street Food",
              ].map((category) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={category}
                  className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm font-medium text-foreground hover:border-brand-500 hover:bg-brand-500/10 transition shadow-sm active:opacity-80"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
