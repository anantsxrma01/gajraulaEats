const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    owner_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    description: {
      type: String
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, default: "Gajraula" },
      state: { type: String, default: "Uttar Pradesh" },
      pincode: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: {
          // [lng, lat]
          type: [Number],
          required: true
        }
      }
    },
    service_radius_km: {
      type: Number,
      default: 5 // shop अपने आस-पास कितना radius cover करेगा
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },
    rejection_reason: {
      type: String
    },
    is_open: {
      type: Boolean,
      default: true
    },
    open_time: {
      type: String, // "09:00"
      default: "09:00"
    },
    close_time: {
      type: String,
      default: "23:00"
    },
    commission_percent: {
      type: Number,
      default: 20 // platform commission
    },
    logo_url: {
      type: String
    },
    tags: [String], // e.g. ["pizza", "north-indian"]
    
   // FRAUD TRACKING FIELDS
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

    // Useful for cancellation rate detection
    total_orders: {
      type: Number,
      default: 0,
    },

    cancelled_by_shop: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

// Geo index (future nearby search ke liye)
shopSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);
