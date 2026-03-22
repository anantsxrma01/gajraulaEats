// src/models/ShopEarning.js
const mongoose = require("mongoose");

const shopEarningSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true
    },
    gross_amount: { type: Number, required: true }, // sub_total
    commission_percent: { type: Number, required: true },
    commission_amount: { type: Number, required: true },
    net_payable: { type: Number, required: true }, // gross - commission
    is_settled: { type: Boolean, default: false },
    payout_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payout"
    },
    settled_at: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopEarning", shopEarningSchema);