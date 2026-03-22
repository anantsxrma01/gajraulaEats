const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook
} = require("../controllers/paymentController");

const router = express.Router();

// Razorpay order create (user must be logged in)
router.post("/razorpay/order", auth, createRazorpayOrder);

// Verify payment after checkout
router.post("/razorpay/verify", auth, verifyRazorpayPayment);

// Webhook (Razorpay calls this) – no auth, but should have signature validation
router.post("/razorpay/webhook", express.json({ type: "*/*" }), handleRazorpayWebhook);

module.exports = router;