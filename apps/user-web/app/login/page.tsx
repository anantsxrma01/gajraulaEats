"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const { loginWithOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      setStep("OTP");
      setMsg("OTP sent (dev: 1234)");
    } catch (e: any) {
      setMsg(e.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      await loginWithOtp(phone, otp);
      window.location.href = "/";
    } catch (e: any) {
      setMsg(e.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')] bg-cover bg-center">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 glass-card rounded-3xl border-brand-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Gajraula Eats account</p>
          </div>
          
          {step === "PHONE" ? (
            <form onSubmit={sendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="phone">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Enter your mobile number"
                    className="flex h-12 w-full rounded-xl border border-border bg-input/50 pl-12 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 transition-colors"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25 uppercase tracking-wider"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-6">
              <div className="space-y-2 text-center mb-6">
                <p className="text-sm text-muted-foreground">We've sent a code to <span className="text-foreground font-medium">+91 {phone}</span></p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="otp">
                  One Time Password
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 4-digit OTP"
                  maxLength={6}
                  className="flex h-12 w-full text-center tracking-[1em] font-mono text-xl rounded-xl border border-border bg-input/50 px-4 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-500 transition-colors"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25 uppercase tracking-wider"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              
              <div className="text-center mt-4">
                 <button 
                   type="button" 
                   onClick={() => setStep("PHONE")} 
                   className="text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
                 >
                   Change phone number
                 </button>
              </div>
            </form>
          )}

          {msg && (
            <div className="mt-6 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center">
              <p className="text-sm text-brand-500">{msg}</p>
            </div>
          )}
          
        </div>
      </main>
    </>
  );
}
