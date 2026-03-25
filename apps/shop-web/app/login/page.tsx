"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/apiClient";

export default function LoginPage() {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      setStep("OTP");
      setMessage("OTP sent successfully");
    } catch (e: any) {
      setMessage(e.message || "Error");
    }
  };

  const verify = async () => {
    try {
      await login(phone, otp);
      // redirect to dashboard
      window.location.href = "/dashboard";
    } catch (e: any) {
      setMessage(e.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border rounded-xl p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Shop Panel Login</h1>

        {step === "PHONE" && (
          <>
            <input
              type="tel"
              placeholder="Phone"
              className="border rounded px-3 py-2 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="w-full border rounded px-3 py-2"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border rounded px-3 py-2 w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verify}
              className="w-full border rounded px-3 py-2"
            >
              Verify & Login
            </button>
          </>
        )}

        {message && <p className="text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}
