"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // <- owner-portal ka AuthContext
import { apiFetch } from "@/lib/apiClient";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

export default function ProtectedOwnerShell({ children }: Props) {
  const { user, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optional: thoda owner info / quick stats ke liye
  const [ownerName, setOwnerName] = useState<string | null>(null);

  useEffect(() => {
    const verifyOwner = async () => {
      try {
        // Agar auth context hi bol दे कि user nahi hai → login bhej do
        if (!user) {
          window.location.href = "/login";
          return;
        }

        // Role check: sirf OWNER allow
        if (user.role !== "OWNER") {
          setError("You are not allowed to access the Owner Portal.");
          // चाहो तो सीधे logout + redirect:
          logout();
          return;
        }

        // Token + role ठीक है तो ek light admin API hit karke verify:
        // koi bhi admin endpoint चलेगा; yaha shops list ka use kar rahe:
        await apiFetch("/admin/shops?status=PENDING");

        // Optional: yaha future me /admin/me se naam laa sakte ho
        setOwnerName(user.phone || "Owner");
      } catch (e: any) {
        console.error(e);
        setError("Session expired or unauthorized. Please login again.");
        logout();
      } finally {
        setChecking(false);
      }
    };

    // Auth context loading khatam hote hi verify karo
    if (!loading) {
      verifyOwner();
    }
  }, [loading, user, logout]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm">
        Checking owner access…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-sm">
        <p>{error}</p>
        <button
          onClick={logout}
          className="border px-3 py-1 rounded text-xs"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4 flex flex-col gap-4">
        <div className="space-y-1">
          <div className="font-bold text-lg">Owner Portal</div>
          <div className="text-xs opacity-70">
            Logged in as: {ownerName || "Owner"}
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/dashboard" className="hover:underline">
            Overview / Analytics
          </Link>
          <Link href="/shops" className="hover:underline">
            Shops Approval
          </Link>
          <Link href="/delivery-partners" className="hover:underline">
            Delivery Partners
          </Link>
          <Link href="/payouts" className="hover:underline">
            Payouts
          </Link>
          <Link href="/settings" className="hover:underline">
            Platform Settings
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-auto border px-3 py-1 rounded text-xs"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
