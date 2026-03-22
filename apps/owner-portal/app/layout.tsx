import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Owner Portal — Gajraula Eats",
  description: "Owner administration for the Gajraula Eats food delivery platform.",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}