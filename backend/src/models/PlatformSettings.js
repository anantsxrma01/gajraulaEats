const mongoose = require("mongoose");

const platformSettingsSchema = new mongoose.Schema(
  {
    // सिर्फ एक ही document use करेंगे, e.g. key = "GLOBAL"
    key: {
      type: String,
      unique: true,
      default: "GLOBAL"
    },

    // Platform center (Gajraula)
    platform_center: {
      lat: { type: Number, default: 28.8455 },
      lng: { type: Number, default: 78.2301 }
    },

    // Service radius from center in KM
    platform_radius_km: {
      type: Number,
      default: 30
    },

    // Delivery fee calculation
    delivery_base_fee: {
      type: Number,
      default: 20 // e.g. ₹20 base charge
    },
    delivery_base_distance_km: {
      type: Number,
      default: 3 // first 3km → base fee
    },
    delivery_per_km_fee_after_base: {
      type: Number,
      default: 5 // per km after base_distance
    },

    // Default commission for shops (% of order value)
    default_shop_commission_percent: {
      type: Number,
      default: 20
    },

    // Default per-km payout to delivery partner (optional, future use)
    default_dp_per_km_rate: {
      type: Number,
      default: 7
    },

    // Toggle for entire service
    is_service_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformSettings", platformSettingsSchema);
