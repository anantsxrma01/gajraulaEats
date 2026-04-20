const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const Shop = require("../models/Shop");
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
      await createAndSendNotification({
        userId: null, 
        orderId: null,
        channel: "SMS",
        type: "AUTH_OTP",
        title: "Login OTP",
        message: message,
        to: phone.startsWith("+") ? phone : `+91${phone}`,
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
    const { phone, otp, role } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    // Find and validate OTP
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete OTP to prevent reuse
    await Otp.deleteOne({ _id: otpRecord._id });

    // ── 1. Find or create user ────────────────────────────────────────────────
    let user = await User.findOne({ phone });

    if (!user) {
      // Determine role: use provided role, default to CUSTOMER
      const assignedRole = role && ["SHOP_OWNER", "CUSTOMER", "DELIVERY_PARTNER"].includes(role)
        ? role
        : "CUSTOMER";

      console.log(`[Auth] Creating new user: phone=${phone} role=${assignedRole}`);
      user = await User.create({ phone, role: assignedRole });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ message: "User is blocked" });
    }

    // ── 2. SHOP_OWNER: auto-create PENDING shop if none exists ────────────────
    let shopData = null;

    if (user.role === "SHOP_OWNER") {
      let shop = await Shop.findOne({ owner_user_id: user._id });

      if (!shop) {
        console.log(`[Auth] Auto-creating PENDING shop for SHOP_OWNER: ${phone}`);
        try {
          shop = await Shop.create({
            owner_user_id: user._id,
            name: "New Shop",          // owner fills this in later via settings
            status: "PENDING",
            is_open: false,
            address: {
              line1: "To be updated",
              city: "Gajraula",
              state: "Uttar Pradesh",
              location: {
                type: "Point",
                coordinates: [78.2276, 28.8955]  // Gajraula default coords
              }
            }
          });
        } catch (shopErr) {
          // If unique constraint fires (race condition), just fetch it
          console.warn("[Auth] Shop create conflict, fetching existing:", shopErr.message);
          shop = await Shop.findOne({ owner_user_id: user._id });
        }
      }

      if (shop) {
        shopData = {
          _id: shop._id,
          name: shop.name,
          status: shop.status,
          isActive: shop.is_open,
          rejectionReason: shop.rejection_reason || null
        };
      }
    }

    // ── 3. Sign JWT ───────────────────────────────────────────────────────────
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // ── 4. Respond ────────────────────────────────────────────────────────────
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        name: user.name
      },
      shop: shopData   // null for non-SHOP_OWNER roles
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