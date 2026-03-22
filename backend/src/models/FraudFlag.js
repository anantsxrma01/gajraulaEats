const mongoose = require("mongoose");

const fraudFlagSchema = new mongoose.Schema(
  {
    entity_type: {
      type: String,
      enum: ["USER", "SHOP", "DELIVERY_PARTNER", "ORDER"],
      required: true,
      index: true
    },

    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    },

    type: {
      type: String,
      required: true,
      // Example values: COD_ABUSE, HIGH_CANCEL_RATE, FREQUENT_REJECTION, SUSPICIOUS_ROUTE
      index: true
    },

    severity: {
      type: Number, // 1 (low) → 5 (high)
      required: true,
      min: 1,
      max: 5
    },

    risk_points: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["OPEN", "REVIEWED", "CLOSED"],
      default: "OPEN",
      index: true
    },

    message: {
      type: String,
      required: true
    },

    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    review_note: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Helpful indexes for fast querying
fraudFlagSchema.index({ entity_type: 1, entity_id: 1 });
fraudFlagSchema.index({ createdAt: -1 });

module.exports = mongoose.model("FraudFlag", fraudFlagSchema);
