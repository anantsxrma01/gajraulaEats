const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { createAndSendNotification } = require("../services/notificationService");

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Generate real OTP or fallback to 1234 if Twilio isn't set
    let otpCode = "1234";
    const hasTwilio = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== "your_twilio_account_sid";
    
    if (hasTwilio) {
      otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Upsert OTP in DB (delete old one if exists, create new)
    await Otp.deleteMany({ phone });
    await Otp.create({ phone, otp: otpCode });

    const message = `Your Gajraula Eats login code is: ${otpCode}. Valid for 5 minutes.`;

    try {
      // Send the SMS
      await createAndSendNotification({
        userId: null, 
        orderId: null,
        channel: "SMS",
        type: "AUTH_OTP",
        title: "Login OTP",
        message: message,
        to: phone.startsWith("+") ? phone : `+91${phone}`, // Assume Indian number by default if no +
        meta: {}
      });

      return res.json({
        success: true,
        phone,
        message: hasTwilio ? "OTP sent successfully." : "OTP sent (dev mode). Use 1234."
      });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError.message);
      return res.status(500).json({ message: "Failed to send SMS OTP. Please try again." });
    }

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

    // Find the OTP in DB
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete the OTP to prevent reuse
    await Otp.deleteOne({ _id: otpRecord._id });

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