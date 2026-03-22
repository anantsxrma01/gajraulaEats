const mongoose = require("mongoose");

const USER_ROLES = [
  "CUSTOMER",
  "SHOP_OWNER",
  "DELIVERY_PARTNER",
  "MANAGER",
  "OWNER"
];

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "CUSTOMER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    
   // FRAUD CONTROL FIELDS
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

    // automatically disable COD if fraud score high
    cod_blocked: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.USER_ROLES = USER_ROLES;
