const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
      index: true
    },
    channel: {
      type: String,
      enum: ["SMS", "PUSH", "IN_APP"],
      required: true
    },
    type: {
      type: String,
      // e.g. ORDER_PLACED, ORDER_CONFIRMED...
      required: true
    },
    title: {
      type: String
    },
    message: {
      type: String,
      required: true
    },
    to: {
      type: String // phone number, device token, etc. (for SMS/PUSH)
    },
    meta: {
      type: Object // extra data if needed
    },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING"
    },
    error: {
      type: String
    },
    is_read: {
      type: Boolean,
      default: false // for IN_APP
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);