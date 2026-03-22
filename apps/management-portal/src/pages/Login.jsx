import React, { useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState("PHONE");
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
        setError("You are not authorized for the management portal.");
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

  const inputStyle = {
    width: "100%", padding: "11px 16px", borderRadius: 10, fontSize: 14,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fafafa", outline: "none", transition: "border-color 0.2s"
  };

  const btnStyle = (disabled) => ({
    width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600,
    background: disabled ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "white", border: "none", cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 0 24px rgba(139,92,246,0.3)", transition: "all 0.2s"
  });

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20
    }}>
      <div className="glass" style={{
        width: "100%", maxWidth: 400, borderRadius: 20, padding: 36,
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 0 30px rgba(139,92,246,0.4)"
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>Management Portal</h1>
          <p style={{ fontSize: 13, color: "#71717a" }}>
            {step === "PHONE" ? "Enter your admin phone number" : `Code sent to +91 ${phone}`}
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13,
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)"
          }}>
            {error}
          </div>
        )}

        {step === "PHONE" ? (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#a1a1aa", marginBottom: 6 }}>
                Mobile Number
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 14, color: "#71717a", fontWeight: 500
                }}>+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 46 }}
                  placeholder="Enter admin phone"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#a1a1aa", marginBottom: 6 }}>
                One-Time Password
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.4em", fontSize: 20, fontWeight: 700 }}
                placeholder="• • • •"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Verifying…" : "Verify & Login"}
            </button>
            <button type="button" onClick={() => setStep("PHONE")} style={{
              background: "none", border: "none", color: "#71717a", fontSize: 12,
              textAlign: "center", cursor: "pointer"
            }}>
              ← Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
