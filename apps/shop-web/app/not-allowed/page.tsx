"use client";

import { useEffect, useState } from "react";
import { useAuth, ShopInfo } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function NotAllowedPage() {
  const { user, shop, logout, loading } = useAuth();
  const router = useRouter();
  const [shopStatus, setShopStatus] = useState<string>("PENDING");

  useEffect(() => {
    if (loading) return;
    // If somehow they are approved, send them to dashboard
    if (user && shop?.status === "APPROVED") {
      router.replace("/dashboard");
      return;
    }
    if (shop?.status) setShopStatus(shop.status);
  }, [user, shop, loading, router]);

  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING: {
      label: "Pending Approval",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.2)",
    },
    REJECTED: {
      label: "Application Rejected",
      color: "#f87171",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.2)",
    },
    SUSPENDED: {
      label: "Account Suspended",
      color: "#fb923c",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.2)",
    },
  };

  const status = statusConfig[shopStatus] || statusConfig["PENDING"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(251,191,36,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-md w-full">
        <div
          className="rounded-2xl p-8 text-center space-y-6"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            <svg className="w-10 h-10" style={{ color: "#fbbf24" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-3">Shop Under Review</h1>
            <p className="text-zinc-400 leading-relaxed">
              Your shop is under review. You will get access after approval by the platform admin.
            </p>
          </div>

          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mx-auto"
            style={{
              backgroundColor: status.bg,
              border: `1px solid ${status.border}`,
              color: status.color,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: status.color,
                animation: shopStatus === "PENDING" ? "pulse 2s infinite" : "none",
              }}
            />
            {status.label}
          </div>

          {/* Contextual message per status */}
          {shopStatus === "REJECTED" && (
            <div
              className="p-4 rounded-xl text-sm text-left"
              style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <p className="font-semibold text-red-400 mb-1">Application Rejected</p>
              <p className="text-zinc-400">
                Your shop application was rejected. Please contact support or re-apply with correct information.
              </p>
            </div>
          )}

          {shopStatus === "PENDING" && (
            <div
              className="p-4 rounded-xl text-sm text-left"
              style={{ backgroundColor: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}
            >
              <p className="font-semibold text-amber-400 mb-1">What happens next?</p>
              <p className="text-zinc-400">
                Our team reviews new shops usually within 24 hours. You'll be able to log in and access the dashboard once approved.
              </p>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
