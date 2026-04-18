import { Router } from "express";

const router = Router();

// ------------------
// SEND OTP
// ------------------
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body || {};

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required",
      });
    }

    // Dummy OTP logic (replace later)
    const otp = "123456";

    console.log(`📲 OTP sent to ${mobile}`);

    return res.json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.error("❌ send-otp error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ------------------
// VERIFY OTP
// ------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body || {};

    if (!mobile || !otp) {
      return res.status(400).json({
        message: "Mobile and OTP required",
      });
    }

    // Dummy validation
    if (otp !== "123456") {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    return res.json({
      message: "OTP verified successfully",
      token: "dummy-jwt-token",
    });
  } catch (err) {
    console.error("❌ verify-otp error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;