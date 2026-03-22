const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    created_by_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    type: {
      type: String,
      enum: ["ORDER_ISSUE", "PAYMENT_ISSUE", "APP_ISSUE", "OTHER"],
      default: "ORDER_ISSUE"
    },
    subject: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
      index: true
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },
    assigned_to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    internal_notes: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
        created_at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportTicket", ticketSchema);
