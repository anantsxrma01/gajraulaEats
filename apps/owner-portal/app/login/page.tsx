"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { sendOtp, loginWithOtp } = useAuth();
  const router = useRouter();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return toast.error("Enter a valid phone number");
    
    setLoading(true);
    try {
      await sendOtp(phone);
      toast.success("OTP sent to your phone");
      setStep("OTP");
    } catch (e: any) {
      toast.error(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return toast.error("Enter a valid OTP");
    
    setLoading(true);
    try {
      await loginWithOtp(phone, otp);
      toast.success("Login successful!");
      router.replace("/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] mx-auto mb-6">
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Owner Portal</h1>
          <p className="text-zinc-400">Manage your business operations</p>
        </div>

        <div className="glass p-8 rounded-3xl">
          <AnimatePresence mode="wait">
            {step === "PHONE" ? (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full h-12" loading={loading}>
                  Continue securely
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-6"
              >
                <div className="space-y-2 text-center mb-2">
                  <p className="text-sm text-zinc-400">OTP sent to +91 {phone}</p>
                </div>
                <Input
                  className="text-center tracking-[0.5em] text-2xl font-bold"
                  type="text"
                  placeholder="••••"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
                <Button type="submit" className="w-full h-12" loading={loading}>
                  Verify & Login
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep("PHONE")}
                  className="w-full text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Change phone number
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
