const mongoose = require("mongoose");

const USER_ROLES = [
  "CUSTOMER",
  "SHOP_OWNER",
  "DELIVERY_PARTNER",
  "MANAGER",
  "OWNER"
];

const APPROVAL_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

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
    /**
     * Approval gate for privileged roles.
     * CUSTOMER → always APPROVED (no review needed).
     * SHOP_OWNER / DELIVERY_PARTNER / MANAGER → start as PENDING until admin approves.
     */
    approvalStatus: {
      type: String,
      enum: APPROVAL_STATUSES,
      default: "APPROVED",   // CUSTOMER default; reassigned for privileged roles
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    // Which admin/owner created this account (used for MANAGER creation)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── FRAUD CONTROL FIELDS ──────────────────────────────────────────────────
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
    // Automatically disable COD if fraud score is high
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
module.exports.APPROVAL_STATUSES = APPROVAL_STATUSES;
