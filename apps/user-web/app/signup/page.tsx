"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiFetch, setAuthToken } from "@/lib/apiClient";

export default function SignupPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form Data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      
      if (res.success) {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      });
      
      if (res.success && res.token) {
        setAuthToken(res.token);
        // Save user info optionally (e.g. in Context, but for now just redirect)
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000')] bg-cover bg-center">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 glass-card rounded-3xl border-brand-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              {step === 1 ? "Join Gajraula Eats for premium food delivery" : "Enter the OTP sent to your phone"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="flex h-12 w-full rounded-xl border border-border bg-input/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="flex h-12 w-full rounded-xl border border-border bg-input/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="phone">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="flex h-12 w-full rounded-xl border border-border bg-input/50 pl-12 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex h-12 w-full rounded-xl border border-border bg-input/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25 uppercase tracking-wider"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="otp">
                  One Time Password
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 1234"
                  className="flex h-12 w-full rounded-xl border border-border bg-input/50 px-4 py-2 text-sm ring-offset-background tracking-[0.5em] text-center font-mono placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  (In dev mode, the OTP is usually 1234)
                </p>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25 uppercase tracking-wider"
              >
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors hover:bg-muted"
              >
                Back to details
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-500 hover:text-brand-400 font-medium transition-colors">
              Sign in
            </Link>
          </div>
          
        </div>
      </main>
    </>
  );
}
