import { api } from "./apiClient";

// 📲 Send OTP
export const sendOtp = (phone: string) =>
  api.post("/auth/send-otp", { phone });

// 🔐 Verify OTP
export const verifyOtp = (phone: string, otp: string) =>
  api.post("/auth/verify-otp", { phone, otp });