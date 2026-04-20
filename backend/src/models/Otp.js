const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    index: { expires: 0 }, // MongoDB TTL: auto-delete when expiresAt is reached
  }
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
