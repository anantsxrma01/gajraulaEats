"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { loginWithOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("PHONE");
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    try {
      await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone })
      });
      setMsg("OTP sent successfully.");
      setStep("OTP");
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await loginWithOtp(phone, otp);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded-xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Owner Login</h1>

        {step === "PHONE" && (
          <>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="w-full border px-3 py-2 rounded"
              onClick={sendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full border px-3 py-2 rounded"
              onClick={verifyOtp}
            >
              Verify & Login
            </button>
          </>
        )}

        {msg && <p className="text-center text-sm">{msg}</p>}
      </div>
    </div>
  );
}
