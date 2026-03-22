const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    is_veg: {
      type: Boolean,
      default: true
    },
    in_stock: {
      type: Boolean,
      default: true
    },
    is_available: {
      type: Boolean,
      default: true // e.g. temporarily unavailable
    },
    image_url: {
      type: String
    },
    tags: [String], // e.g. ["spicy", "paneer"]
    preparation_time_minutes: {
      type: Number,
      default: 15
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);