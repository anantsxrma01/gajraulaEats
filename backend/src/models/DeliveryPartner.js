const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    vehicle_type: {
      type: String,
      enum: ["BIKE", "SCOOTER", "CYCLE", "OTHER"],
      default: "BIKE"
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "INACTIVE", "BANNED"],
      default: "PENDING"
    },
    is_online: {
      type: Boolean,
      default: false
    },
    current_location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        // [lng, lat]
        type: [Number],
        default: [0, 0]
      }
      },
      last_active_at: {
        type: Date
      },
      total_trips: {
        type: Number,
        default: 0
      },
      rating: {
        type: Number,
        default: 5
      },

    // FRAUD MONITORING
      fraud_risk_score: {
        type: Number,
        default: 0,
      },
      fraud_flags_count: {
        type: Number,
        default: 0,
      },
      last_flagged_at: {
        type: Date,
      },

    // To detect frequent rejection of assigned orders
      rejected_assignments: {
        type: Number,
        default: 0,
      },
      last_rejection_at: {
        type: Date
  }
  },
  { timestamps: true }
);

deliveryPartnerSchema.index({ current_location: "2dsphere" });

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
