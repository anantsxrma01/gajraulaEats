import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Gajraula Eats - Premium Delivery",
  description: "Experience the fastest and most delicious food delivery within a 30km radius of Gajraula.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <main className="flex-grow">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}