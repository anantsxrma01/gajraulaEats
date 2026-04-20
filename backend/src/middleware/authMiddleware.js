const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── auth ─────────────────────────────────────────────────────────────────────
// Validates JWT, loads user, populates req.user

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ message: "User is blocked" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      phone: user.phone,
      approvalStatus: user.approvalStatus,
    };

    next();
  } catch (err) {
    console.error("auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ─── allowRoles ───────────────────────────────────────────────────────────────
// Usage: allowRoles("OWNER", "MANAGER")

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role '${req.user?.role}' is not allowed here.`,
        allowed: allowedRoles,
      });
    }
    next();
  };
};

// ─── allowAdmin ───────────────────────────────────────────────────────────────
// Legacy: keeps compatibility with existing routes that use allowAdmin

function allowAdmin(req, res, next) {
  if (!req.user || req.user.role !== "OWNER") {
    return res.status(403).json({ message: "Access restricted to platform owner" });
  }
  next();
}

// ─── requireApproved ─────────────────────────────────────────────────────────
// Must come AFTER auth + allowRoles.
// Blocks SHOP_OWNER / DELIVERY_PARTNER / MANAGER who are not yet APPROVED.

const GATED_ROLES = ["SHOP_OWNER", "DELIVERY_PARTNER", "MANAGER"];

const requireApproved = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (GATED_ROLES.includes(req.user.role) && req.user.approvalStatus !== "APPROVED") {
    return res.status(403).json({
      message: "Your account is pending approval.",
      approvalStatus: req.user.approvalStatus,   // "PENDING" | "REJECTED"
    });
  }

  next();
};

module.exports = {
  auth,
  allowRoles,
  allowAdmin,
  requireApproved,
};