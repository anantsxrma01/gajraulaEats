"use client";

import { useState, useEffect } from "react";
import { useAuth, ShopInfo } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, shop, loading, sendOtp, loginWithOtp } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // If already authenticated, redirect away from login
  useEffect(() => {
    if (loading) return;
    if (user && shop?.status === "APPROVED") {
      router.replace("/dashboard");
    } else if (user && shop) {
      router.replace("/not-allowed");
    }
  }, [user, shop, loading, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, "").slice(0, 10);
    if (cleaned.length < 10) {
      setMessage("Enter a valid 10-digit phone number.");
      setIsError(true);
      return;
    }
    setBusy(true);
    setMessage("");
    setIsError(false);
    try {
      await sendOtp(cleaned);
      setStep("OTP");
      setResendCooldown(30);
      setMessage(`OTP sent to ${cleaned}`);
      setIsError(false);
    } catch (e: any) {
      setMessage(e.message || "Failed to send OTP. Try again.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setMessage("Enter the OTP you received.");
      setIsError(true);
      return;
    }
    setBusy(true);
    setMessage("");
    setIsError(false);
    try {
      const redirect = await loginWithOtp(phone.replace(/\D/g, ""), otp);

      // Show contextual feedback before navigating
      if (redirect === "/not-allowed") {
        setMessage("OTP verified. Your shop is awaiting approval.");
        setIsError(false);
      } else {
        setMessage("Login successful! Redirecting…");
        setIsError(false);
      }

      // Small delay so the user sees the message
      setTimeout(() => router.replace(redirect), 800);
    } catch (e: any) {
      setMessage(e.message || "Invalid OTP. Please try again.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 10%, rgba(16,185,129,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 90%, rgba(5,150,105,0.05) 0%, transparent 40%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-2xl p-8 space-y-6 shadow-2xl"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 0 30px rgba(16,185,129,0.25)",
              }}
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13l-1-5h14" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Shop Panel</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {step === "PHONE" ? "Sign in or create your shop account" : `Enter the code sent to ${phone}`}
            </p>
          </div>

          {/* Feedback Banner */}
          {message && (
            <div
              className="p-3 rounded-xl text-sm text-center"
              style={{
                backgroundColor: isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                border: `1px solid ${isError ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
                color: isError ? "#f87171" : "#34d399",
              }}
            >
              {message}
            </div>
          )}

          {/* Step: Phone */}
          {step === "PHONE" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  disabled={busy}
                  className="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  autoFocus
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={busy || phone.length < 10}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                {busy ? <Spinner /> : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step: OTP */}
          {step === "OTP" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                  One-Time Password
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  disabled={busy}
                  className="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-xl tracking-[0.4em] text-center focus:outline-none transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  autoFocus
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={busy || otp.length < 4}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                {busy ? <Spinner /> : "Verify & Login"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => { setStep("PHONE"); setOtp(""); setMessage(""); }}
                  disabled={busy}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  ← Change number
                </button>
                <button
                  onClick={() => { setOtp(""); handleSendOtp(); }}
                  disabled={busy || resendCooldown > 0}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors disabled:opacity-40"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          First time here? Just enter your phone — we'll create your account automatically.
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
  );
}
