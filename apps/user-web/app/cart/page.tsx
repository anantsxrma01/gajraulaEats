"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getMyAddresses } from "@/lib/addressApi";
import { placeOrder } from "@/lib/ordersApi";
import { useRouter } from "next/navigation";

// Placeholder images for items (since backend might not provide ones immediately)
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"
];

type Address = {
  _id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  is_serviceable: boolean;
};

export default function CartPage() {
  const { cart, totalItems, subTotal, changeQty, removeItem, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [checkoutState, setCheckoutState] = useState<"CART" | "PROCESSING" | "SUCCESS">("CART");
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  // Price calculations
  const deliveryFee = 40; // Fixed for now, ideally calculated backend
  const taxes = Math.round(subTotal * 0.05); // 5% GST
  const total = subTotal + deliveryFee + taxes;

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await getMyAddresses();
      const list: Address[] = data.addresses || [];
      setAddresses(list);
      const def = list.find((a) => a.is_default);
      if (def) setSelectedAddressId(def._id);
      else if (list.length > 0) setSelectedAddressId(list[0]._id);
    } catch (e) {
      console.error("Failed to load addresses", e);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCheckout = async () => {
    setMessage("");

    if (!cart.shopId || cart.items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!selectedAddressId) {
      setMessage("Please select a delivery address.");
      return;
    }

    setCheckoutState("PROCESSING");
    try {
      const payload = {
        shop_id: cart.shopId,
        address_id: selectedAddressId,
        items: cart.items.map((i: { itemId: string; qty: number }) => ({
          item_id: i.itemId,
          qty: i.qty,
        })),
        payment_mode: "COD" as const,
      };

      const data = await placeOrder(payload);

      const orderId = data.order?._id || data.order?.id;
      clearCart();
      setCheckoutState("SUCCESS");

      // Delay redirect to show success state
      setTimeout(() => {
        if (orderId) {
          router.push(`/orders/${orderId}`);
        } else {
          router.push(`/`);
        }
      }, 2500);

    } catch (e: any) {
      setMessage(e.message || "Error placing order");
      setCheckoutState("CART");
    }
  };

  if (checkoutState === "SUCCESS") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-12 glass-card rounded-3xl border-brand-500/20 shadow-2xl">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">Your order has been placed successfully. Redirecting you to order tracking...</p>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Your Cart</h1>

          {totalItems === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border border-border">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-muted-foreground">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">It's empty here!</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/" className="inline-flex h-12 items-center justify-center rounded-xl border border-brand-500 text-brand-500 px-8 text-sm font-bold transition-colors hover:bg-brand-500 hover:text-white uppercase tracking-wider">
                Browse Restaurants
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Cart Items */}
              <div className="lg:w-2/3 space-y-6">
                <div className="glass-card rounded-3xl border border-border p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                      {cart.shopName ? cart.shopName.charAt(0).toUpperCase() : "R"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{cart.shopName || "Restaurant"}</h2>
                      <p className="text-sm text-brand-400 font-medium">Standard Delivery in 30-45 mins</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {cart.items.map((item: { itemId: string; name: string; price: number; qty: number; isVeg: boolean }, index: number) => (
                      <div key={item.itemId} className="flex items-center justify-between group">
                        <div className="flex items-start md:items-center gap-4 flex-1">
                          <div className={`mt-1 md:mt-0 w-4 h-4 rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center flex-shrink-0`}>
                            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg leading-tight mb-1">{item.name}</h3>
                            <p className="text-muted-foreground font-medium text-sm">₹{item.price}</p>
                            <button onClick={() => removeItem(item.itemId)} className="text-xs text-red-400 hover:text-red-300 mt-2 transition-colors md:hidden">Remove</button>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 lg:gap-8">
                          <div className="flex items-center bg-background rounded-xl border border-border shadow-sm">
                            <button
                              onClick={() => changeQty(item.itemId, item.qty - 1)}
                              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50 rounded-l-xl"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-brand-500">{item.qty}</span>
                            <button
                              onClick={() => changeQty(item.itemId, item.qty + 1)}
                              className="w-10 h-10 flex items-center justify-center text-brand-500 hover:text-brand-400 transition-colors hover:bg-brand-500/10 rounded-r-xl"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </button>
                          </div>
                          <div className="w-20 text-right font-bold text-lg">
                            ₹{item.price * item.qty}
                          </div>
                          <button onClick={() => removeItem(item.itemId)} className="hidden md:block w-8 h-8 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50">
                    <button className="flex items-center gap-2 text-brand-500 font-medium hover:text-brand-400 transition-colors bg-brand-500/5 px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      Any specific cooking instructions?
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkout Summary */}
              <div className="lg:w-1/3 space-y-6">
                {/* Addresses */}
                <div className="glass-card rounded-3xl border border-border p-6 shadow-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Delivery Address
                  </h3>
                  {loadingAddresses ? (
                    <div className="h-20 flex justify-center items-center">
                      <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-sm p-4 bg-muted/50 rounded-xl border border-border text-center">
                      <p className="text-muted-foreground mb-3">No saved addresses found.</p>
                      <Link href="/addresses" className="text-brand-500 font-medium hover:underline">Add New Address</Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {addresses.map((addr: Address) => (
                        <label key={addr._id} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500' : 'border-border bg-input/20 hover:border-brand-500/50'}`}>
                          <div className="pt-1">
                            <input
                              type="radio"
                              name="address"
                              value={addr._id}
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                              className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-border bg-background"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-foreground capitalize">{addr.label}</span>
                              {addr.is_default && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-brand-500 text-white uppercase tracking-wider">Default</span>}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{addr.line1}, {addr.city}</p>
                            {!addr.is_serviceable && <p className="text-xs text-red-500 mt-1 font-medium">Outside Service Area</p>}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bill Summary */}
                <div className="sticky top-28 glass-card rounded-3xl border border-border p-6 shadow-2xl">
                  <h3 className="text-lg font-bold mb-4">Bill Details</h3>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Item Total</span>
                      <span className="text-foreground font-medium">₹{subTotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Partner Fee</span>
                      <span className="text-foreground font-medium">₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & Charges (GST)</span>
                      <span className="text-foreground font-medium">₹{taxes}</span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/50 flex justify-between items-center bg-brand-500/10 p-4 rounded-xl border border-brand-500/20 shadow-inner">
                      <div>
                        <span className="font-bold text-lg text-brand-400 block leading-none">Total</span>
                        <span className="text-xs text-brand-500 tracking-wider">Via COD</span>
                      </div>
                      <span className="font-bold text-2xl text-foreground">₹{total}</span>
                    </div>
                  </div>

                  {message && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl font-medium flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {message}
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutState === "PROCESSING" || totalItems === 0 || !selectedAddressId}
                    className="w-full h-14 inline-flex items-center justify-center rounded-xl text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground bg-brand-600 text-white hover:bg-brand-500 shadow-xl shadow-brand-500/30 uppercase tracking-widest relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10">{checkoutState === "PROCESSING" ? "Placing Order..." : "Place Order (COD)"}</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}