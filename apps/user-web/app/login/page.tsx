"use client";

import { useState } from "react";
import { sendOtp, verifyOtp } from "@/lib/authApi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  // 👉 Send OTP
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Please enter a phone number");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await sendOtp(phone);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await verifyOtp(phone, otp);

      login(res.token, res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md glass-card p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-card border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 bg-card border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p
              className="text-sm text-center mt-4 text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => setStep(1)}
            >
              Change number
            </p>
          </>
        )}
      </div>
    </div>
  );
}