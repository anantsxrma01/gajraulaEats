"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col pt-24 bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 max-w-7xl py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}