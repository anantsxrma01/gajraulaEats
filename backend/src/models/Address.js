const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    label: {
      type: String, // "Home", "Office" etc.
      default: "Home"
    },
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
    },
    is_default: {
      type: Boolean,
      default: false
    },
    is_serviceable: {
      type: Boolean,
      default: true // हम API में calculate करके set करेंगे
    },
    distance_from_center_km: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Important: geospatial index
addressSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Address", addressSchema);