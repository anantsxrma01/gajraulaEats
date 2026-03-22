// backend/src/controllers/authController.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Dev mode OTP
    const devOtp = "1234";

    return res.json({
      success: true,
      phone,
      otp: devOtp, // dev only, frontend ko production me mat dikhana
      message: "OTP sent (dev mode). Use 1234."
    });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    // Dev mode check
    if (otp !== "1234") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user;
    try {
      user = await User.findOne({ phone });
    } catch (dbErr) {
      console.warn("DB findOne failed, using mock user. Error:", dbErr.message);
      // Mock user for dev purposes
      user = { _id: "mock-id-123", phone, role: "CUSTOMER", status: "ACTIVE", name: "Mock User" };
    }

    if (!user) {
      try {
        user = await User.create({ phone, role: "CUSTOMER" });
      } catch (dbErr) {
        console.warn("DB create failed, using mock user. Error:", dbErr.message);
        user = { _id: "mock-id-" + Date.now(), phone, role: "CUSTOMER", status: "ACTIVE", name: "Mock User" };
      }
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ message: "User is blocked" });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name
      }
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};