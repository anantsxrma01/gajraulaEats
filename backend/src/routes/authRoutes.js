// backend/src/routes/authRoutes.js

const express = require("express");
const { sendOtp, verifyOtp } = require("../controllers/authController");

const router = express.Router();

// Dev mode: OTP send
router.post("/send-otp", sendOtp);

// Dev mode: OTP verify
router.post("/verify-otp", verifyOtp);

module.exports = router;   // 👈 IMPORTANT: sirf ye, koi object / default export nahi