import express, { Request, Response } from "express";

const router = express.Router();

/**
 * POST /api/auth/signup
 */
router.post("/signup", (req: Request, res: Response) => {
  try {
    const { firstName, lastName, mobile, email } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    return res.status(200).json({
      message: "Signup successful",
      data: { firstName, lastName, mobile, email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
});

/**
 * POST /api/auth/send-otp
 */
router.post("/send-otp", (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      otp: "123456", // dummy OTP (replace later with real logic)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

/**
 * POST /api/auth/login
 */
router.post("/login", (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Login successful",
      token: "dummy-jwt-token",
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;
