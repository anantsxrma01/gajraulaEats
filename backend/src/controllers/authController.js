const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const Shop = require("../models/Shop");
const { createAndSendNotification } = require("../services/notificationService");
const { normalizePhone } = require("../utils/phoneUtils");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Roles that require an approval check before accessing their portal */
const GATED_ROLES = ["SHOP_OWNER", "DELIVERY_PARTNER", "MANAGER"];

/** Generate a 4-digit numeric OTP string */
function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// ─── sendOtp ──────────────────────────────────────────────────────────────────

const sendOtp = async (req, res) => {
  try {
    const raw = req.body.phone;
    if (!raw) return res.status(400).json({ message: "Phone is required" });

    const phone = normalizePhone(raw);
    if (phone.length !== 10) {
      return res.status(400).json({ message: "Invalid phone number. Must be 10 digits." });
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert — overwrite any existing OTP for this phone
    await Otp.findOneAndUpdate(
      { phone },
      { phone, otp: otpCode, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[OTP] phone=${phone} otp=${otpCode} expiresAt=${expiresAt.toISOString()}`);

    const message = `Your Gajraula Eats login code is: ${otpCode}. Valid for 5 minutes.`;

    // Attempt SMS — failure must NOT block login
    const hasTwilio =
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_ACCOUNT_SID !== "your_twilio_account_sid";

    if (hasTwilio) {
      try {
        await createAndSendNotification({
          userId: null,
          orderId: null,
          channel: "SMS",
          type: "AUTH_OTP",
          title: "Login OTP",
          message,
          to: `+91${phone}`,
          meta: {},
        });
      } catch (smsErr) {
        // Log but do not fail — OTP is in DB and console
        console.warn("[OTP] SMS failed (dev mode fallback active):", smsErr.message);
      }
    }

    return res.json({
      success: true,
      phone,
      message: hasTwilio
        ? "OTP sent to your phone."
        : `OTP sent (dev mode). Check server console.`,
    });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── verifyOtp ────────────────────────────────────────────────────────────────

const verifyOtp = async (req, res) => {
  try {
    const raw = req.body.phone;
    const inputOtp = String(req.body.otp || "").trim();

    if (!raw || !inputOtp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const phone = normalizePhone(raw);

    // ── Debug logs ────────────────────────────────────────────────────────────
    console.log(`[Auth] verifyOtp: phone=${phone} inputOtp=${inputOtp}`);

    // ── Fetch OTP record ──────────────────────────────────────────────────────
    const otpRecord = await Otp.findOne({ phone });

    if (!otpRecord) {
      console.warn(`[Auth] No OTP found for phone=${phone}`);
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    console.log(`[Auth] storedOtp=${otpRecord.otp} expiresAt=${otpRecord.expiresAt}`);

    // ── Expiry check ──────────────────────────────────────────────────────────
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // ── String comparison ─────────────────────────────────────────────────────
    if (String(otpRecord.otp) !== inputOtp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // ── Consume OTP ───────────────────────────────────────────────────────────
    await Otp.deleteOne({ _id: otpRecord._id });

    // ── Find or create user (always CUSTOMER on first login) ──────────────────
    let user = await User.findOne({ phone });

    if (!user) {
      console.log(`[Auth] New user: phone=${phone} → CUSTOMER`);
      user = await User.create({
        phone,
        role: "CUSTOMER",
        approvalStatus: "APPROVED",
        status: "ACTIVE",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    // ── Approval gate for privileged roles ────────────────────────────────────
    if (GATED_ROLES.includes(user.role) && user.approvalStatus !== "APPROVED") {
      // Still return a token so the frontend can fetch their status
      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          phone: user.phone,
          role: user.role,
          approvalStatus: user.approvalStatus,
          name: user.name,
        },
        shop: null,
        approvalStatus: user.approvalStatus,  // frontend convenience key
      });
    }

    // ── SHOP_OWNER: attach shop data ──────────────────────────────────────────
    let shopData = null;
    if (user.role === "SHOP_OWNER") {
      let shop = await Shop.findOne({ owner_user_id: user._id });

      if (!shop) {
        console.log(`[Auth] Auto-creating PENDING shop for SHOP_OWNER: ${phone}`);
        try {
          shop = await Shop.create({
            owner_user_id: user._id,
            name: "New Shop",
            status: "PENDING",
            is_open: false,
            address: {
              line1: "To be updated",
              city: "Gajraula",
              state: "Uttar Pradesh",
              location: { type: "Point", coordinates: [78.2276, 28.8955] },
            },
          });
        } catch (shopErr) {
          console.warn("[Auth] Shop create conflict:", shopErr.message);
          shop = await Shop.findOne({ owner_user_id: user._id });
        }
      }

      if (shop) {
        shopData = {
          _id: shop._id,
          name: shop.name,
          status: shop.status,
          isActive: shop.is_open,
          rejectionReason: shop.rejection_reason || null,
        };
      }
    }

    // ── Sign JWT ──────────────────────────────────────────────────────────────
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        approvalStatus: user.approvalStatus,
        name: user.name,
      },
      shop: shopData,
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendOtp, verifyOtp };