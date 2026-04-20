"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";

export default function LoginPage() {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone) return;
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      await api.post("/auth/send-otp", { phone });
      setStep("OTP");
      setMessage("OTP sent successfully to " + phone);
      setIsError(false);
    } catch (e: any) {
      setMessage(e.message || "Failed to send OTP");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!otp) return;
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      await login(phone, otp);
      // redirect to dashboard
      window.location.href = "/dashboard";
    } catch (e: any) {
      setMessage(e.message || "Invalid OTP or Error");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black/30 border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-6 shadow-xl shadow-brand-500/5">
        <div className="text-center">
           <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Shop Panel</h1>
           <p className="text-zinc-400 text-sm">Sign in to manage your shop</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm text-center ${isError ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'}`}>
            {message}
          </div>
        )}

        {step === "PHONE" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1 ml-1 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                placeholder="Ex. 9876543210"
                className="bg-black border border-white/10 rounded-xl px-4 py-3 w-full text-white placeholder-white/20 focus:outline-none focus:border-brand-500 transition-colors"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading || !phone}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl px-4 py-3 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Send OTP"}
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1 ml-1 uppercase tracking-wider">Enter OTP</label>
              <input
                type="text"
                placeholder="Ex. 123456"
                className="bg-black border border-white/10 rounded-xl px-4 py-3 w-full text-white placeholder-white/20 focus:outline-none focus:border-brand-500 transition-colors"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              onClick={verify}
              disabled={loading || !otp}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl px-4 py-3 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Verify & Login"}
            </button>
            <button 
              onClick={() => { setStep("PHONE"); setOtp(""); setMessage(""); }}
              className="w-full text-sm text-zinc-500 hover:text-white transition-colors"
              disabled={loading}
            >
               Change phone number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
