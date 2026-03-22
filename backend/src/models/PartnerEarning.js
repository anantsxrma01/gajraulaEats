// src/models/PartnerEarning.js
const mongoose = require("mongoose");

const partnerEarningSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true
    },
    delivery_partner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      required: true,
      index: true
    },
    base_amount: { type: Number, required: true },
    distance_km: { type: Number, required: true },
    per_km_rate: { type: Number, required: true },
    variable_amount: { type: Number, required: true },
    total_earning: { type: Number, required: true }, // base + variable
    is_settled: { type: Boolean, default: false },
    payout_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payout"
    },
    settled_at: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerEarning", partnerEarningSchema);