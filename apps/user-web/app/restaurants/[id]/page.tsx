"use client";

import React, { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getShopPublic, getShopMenu } from "@/lib/shopsApi";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// Fallback Mock Data
const MOCK_RESTAURANT = {
  id: "r1",
  name: "Spicy Route",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  rating: 4.8,
  reviews: 1204,
  tags: ["North Indian", "Mughlai", "Biryani"],
  deliveryTime: "25-30 min",
  deliveryFee: "₹40",
  address: "123 Main Street, Gajraula",
  about: "Experience the authentic taste of North Indian cuisine."
};

export default function RestaurantDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id: shopId } = use(params);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { cart, addItem, changeQty, subTotal, totalItems } = useCart();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [shopData, menuData] = await Promise.all([
          getShopPublic(shopId),
          getShopMenu(shopId)
        ]);

        const shopInfo = shopData.shop || {};
        
        setRestaurant({
          id: shopInfo._id || shopInfo.id || shopId,
          name: shopInfo.name || MOCK_RESTAURANT.name,
          image: shopInfo.image_url || shopInfo.cover_image || MOCK_RESTAURANT.image,
          rating: shopInfo.rating || MOCK_RESTAURANT.rating,
          reviews: shopInfo.reviews_count || MOCK_RESTAURANT.reviews,
          tags: shopInfo.tags || shopInfo.cuisines || MOCK_RESTAURANT.tags,
          deliveryTime: shopInfo.delivery_time || MOCK_RESTAURANT.deliveryTime,
          deliveryFee: shopInfo.delivery_fee ? `₹${shopInfo.delivery_fee}` : MOCK_RESTAURANT.deliveryFee,
          address: shopInfo.address || MOCK_RESTAURANT.address,
        });

        const itemsList = menuData.menu || [];
        
        // Group items by category
        const grouped = itemsList.reduce((acc: any, item: any) => {
          const cat = item.category || "Recommended";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({
             id: item._id || item.id,
             name: item.name,
             price: item.price,
             description: item.description,
             vegetarian: item.is_veg !== false,
             image: item.image_url || null
          });
          return acc;
        }, {});

        setCategories(
          Object.keys(grouped).map(catName => ({
            name: catName,
            items: grouped[catName]
          }))
        );

      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
        setRestaurant(MOCK_RESTAURANT);
        setCategories([
          {
            name: "Popular Items",
            items: [
              { id: "m1", name: "Butter Chicken", price: 450, description: "Classic creamy tomato based chicken curry.", vegetarian: false },
              { id: "m2", name: "Paneer Tikka", price: 320, description: "Grilled marinated paneer cubes.", vegetarian: true },
              { id: "m3", name: "Dal Makhani", price: 280, description: "Slow cooked black lentils with cream and butter.", vegetarian: true }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [shopId]);

  if (loading || !restaurant) {
    return (
       <>
         <Navbar />
         <main className="min-h-screen pt-32 pb-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
         </main>
         <Footer />
       </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-24">
        {/* Restaurant Header */}
        <section className="container mx-auto px-6 max-w-7xl">
          <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${restaurant.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute text-left bottom-0 left-0 w-full p-8 md:p-12">
               <div className="flex gap-2 mb-4">
                 {restaurant.tags.map((t: string) => (
                   <span key={t} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                     {t}
                   </span>
                 ))}
               </div>
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">{restaurant.name}</h1>
               <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                 <div className="flex items-center gap-1.5 font-medium text-yellow-400">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                   </svg>
                   <span className="text-white">{restaurant.rating}</span>
                   <span>({restaurant.reviews} reviews)</span>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                 <div className="flex items-center gap-1.5">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   {restaurant.deliveryTime}
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                 <div className="flex items-center gap-1.5">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                   </svg>
                   {restaurant.address}
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="container mx-auto px-6 max-w-7xl pt-8 pb-20 flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-2/3">
            {categories.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground text-lg">No menu items available for this restaurant.</p>
                </div>
            ) : categories.map((category: { name: string; items: any[] }) => (
              <div key={category.name} className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">{category.name}</h2>
                <div className="space-y-6">
                  {category.items.map((item: any) => {
                    const cartItem = cart.items.find((i: { itemId: string }) => i.itemId === item.id);
                    return (
                    <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-card border border-border/50 hover:border-brand-500/30 transition-colors shadow-sm hover:shadow-xl group">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <div className={`w-4 h-4 rounded-sm border ${item.vegetarian ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                <div className={`w-2 h-2 rounded-full ${item.vegetarian ? 'bg-green-600' : 'bg-red-600'}`}></div>
                             </div>
                             <h3 className="text-lg font-bold group-hover:text-brand-500 transition-colors">{item.name}</h3>
                          </div>
                          <p className="font-semibold text-foreground mb-3">₹{item.price}</p>
                          <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-none leading-relaxed">
                            {item.description}
                          </p>
                       </div>
                       
                       <div className="relative w-32 h-32 flex-shrink-0">
                         {item.image ? (
                           <div 
                             className="w-full h-full rounded-2xl bg-cover bg-center shadow-md object-cover"
                             style={{ backgroundImage: `url(${item.image})` }}
                           />
                         ) : (
                           <div className="w-full h-full rounded-2xl bg-muted border border-border flex items-center justify-center shadow-inner">
                             <span className="text-muted-foreground font-bold tracking-widest uppercase text-xs opacity-50">GE</span>
                           </div>
                         )}
                         
                         {cartItem ? (
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-foreground shadow-xl border border-brand-500 rounded-xl font-bold flex items-center overflow-hidden">
                             <button onClick={() => changeQty(item.id, cartItem.qty - 1)} className="px-3 py-2 hover:bg-muted/50 transition-colors">-</button>
                             <span className="px-2 text-brand-600 text-sm">{cartItem.qty}</span>
                             <button onClick={() => changeQty(item.id, cartItem.qty + 1)} className="px-3 py-2 hover:bg-brand-500 hover:text-white transition-colors">+</button>
                           </div>
                         ) : (
                           <button 
                             onClick={() => addItem(restaurant.id, restaurant.name, { itemId: item.id, name: item.name, price: item.price, isVeg: item.vegetarian })}
                             className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-green-600 shadow-xl border border-border px-8 py-2 rounded-xl font-bold uppercase text-xs hover:bg-green-50 transition-colors whitespace-nowrap"
                           >
                             Add
                           </button>
                         )}
                         
                       </div>
                    </div>
                  )})}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-28 bg-card border border-brand-500/20 rounded-3xl p-6 shadow-2xl glass-card">
              <h3 className="text-xl font-bold mb-6">Your Cart</h3>
              
              {totalItems === 0 ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-muted border border-border rounded-full flex items-center justify-center mx-auto mb-4 scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-muted-foreground opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">Add items from the menu to start ordering.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                     <p className="text-sm text-brand-400 font-medium">Ordering from</p>
                     <p className="font-bold">{cart.shopName}</p>
                  </div>
                  
                  <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 mb-6">
                     {cart.items.map((cartItem: { itemId: string; name: string; price: number; qty: number; isVeg: boolean }) => (
                        <div key={cartItem.itemId} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-xs border ${cartItem.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                 <div className={`w-1 h-1 rounded-full ${cartItem.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                              </div>
                              <span className="font-medium line-clamp-1 flex-1 max-w-[120px]">{cartItem.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center bg-input/40 rounded-lg border border-border px-1">
                                <button onClick={() => changeQty(cartItem.itemId, cartItem.qty - 1)} className="w-6 h-6 flex items-center justify-center text-brand-500">-</button>
                                <span className="w-6 text-center text-xs font-bold">{cartItem.qty}</span>
                                <button onClick={() => changeQty(cartItem.itemId, cartItem.qty + 1)} className="w-6 h-6 flex items-center justify-center text-brand-500">+</button>
                              </div>
                              <span className="font-bold w-12 text-right">₹{cartItem.price * cartItem.qty}</span>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 mb-6 flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-xl">₹{subTotal}</span>
                  </div>
                  
                  <Link href="/cart" className="w-full h-12 flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all text-sm uppercase tracking-wider">
                    Checkout →
                  </Link>
                </>
              )}

            </div>
          </div>
          
        </section>

      </main>
      
      <Footer />
    </>
  );
}

