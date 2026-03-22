"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RestaurantCard from "@/components/RestaurantCard";
import Footer from "@/components/Footer";
import { getNearbyShops } from "@/lib/shopsApi";

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
      
      <main className="min-h-screen">
        <HeroSection />
        
        <section className="container mx-auto px-6 max-w-7xl py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Restaurants</h2>
              <p className="text-muted-foreground">The most popular spots in Gajraula right now.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-brand-500 font-medium hover:text-brand-400 transition-colors">
              View All 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
          
          {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant: any) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  image={restaurant.image}
                  rating={restaurant.rating}
                  tags={restaurant.tags}
                  deliveryTime={restaurant.deliveryTime}
                  deliveryFee={restaurant.deliveryFee}
                />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="bg-card w-full py-20 mt-12 border-y border-border">
           <div className="container mx-auto px-6 max-w-7xl">
              <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">Cuisines you'll love</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {["North Indian", "South Indian", "Chinese", "Italian", "Healthy", "Desserts", "Beverages", "Street Food"].map((category) => (
                  <button key={category} className="px-6 py-3 rounded-full border border-border bg-background hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all font-medium whitespace-nowrap">
                    {category}
                  </button>
                ))}
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
