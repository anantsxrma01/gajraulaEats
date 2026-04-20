import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Owner Portal — Gajraula Eats",
  description: "Owner administration for the Gajraula Eats food delivery platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white selection:bg-amber-500/30">
        <Toaster position="top-center" toastOptions={{ className: 'glass !bg-black/90 !text-white !border-white/10' }} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}