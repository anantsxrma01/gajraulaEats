// src/models/Payout.js
const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    entity_type: {
      type: String,
      enum: ["SHOP", "DELIVERY_PARTNER"],
      required: true
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    total_earnings: { type: Number, required: true },
    total_orders: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
      index: true
    },
    paid_at: { type: Date },
    payment_reference: { type: String }, // UTR / txn id etc.
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);