const mongoose = require("mongoose");
const { PAYMENT_STATUSES } = require("./Order");

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    gateway: {
      type: String,
      default: "RAZORPAY"
    },
    gateway_order_id: {
      type: String,
      required: true,
      index: true
    },
    gateway_payment_id: {
      type: String
    },
    gateway_signature: {
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "PENDING"
    },
    raw_response: {
      type: Object
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);