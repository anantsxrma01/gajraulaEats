"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Store, Users, Landmark, Settings, LogOut, Menu, X } from "lucide-react";
import { Loader } from "./ui/Loader";
import toast from "react-hot-toast";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/delivery-partners", label: "Delivery Partners", icon: Users },
  { href: "/payouts", label: "Payouts", icon: Landmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ProtectedOwnerShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }
      if (user.role !== "OWNER" && user.role !== "ADMIN") {
        router.replace("/not-allowed");
        return;
      }
      setChecking(false);
    }
  }, [loading, user, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  const handleLogout = () => {
    toast.success("Successfully logged out");
    logout();
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Store className="text-black w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-widest text-white">
              OWNER<span className="text-amber-500">HUB</span>
            </div>
            <div className="text-xs text-zinc-500 font-medium">{user?.phone || "Admin"}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
              <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                isActive ? "text-amber-400" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-amber-400/10 border border-amber-400/20 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white selection:bg-amber-500/30">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col glass-sidebar z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[280px] flex flex-col glass z-50 lg:hidden border-r border-white/10"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-[72px] flex items-center justify-between px-6 glass border-b border-white/5 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight">
              {NAV.find(n => pathname === n.href || pathname?.startsWith(n.href + "/"))?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold tracking-wider text-amber-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {user?.role}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
