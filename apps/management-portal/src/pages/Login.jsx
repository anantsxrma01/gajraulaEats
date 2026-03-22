import React, { useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState("PHONE"); // PHONE | OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { phone });
      setStep("OTP");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otp });
      const { token, user } = res.data;

      if (!["OWNER", "MANAGER"].includes(user.role)) {
        setError("You are not authorized for management portal.");
        return;
      }

      loginWithToken(token, user);
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Management Portal Login
        </h1>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {step === "PHONE" && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter admin phone"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded py-2 text-sm hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter OTP (dev: 1234)"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded py-2 text-sm hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep("PHONE")}
              className="w-full text-xs text-gray-500 mt-1"
            >
              Change phone
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
