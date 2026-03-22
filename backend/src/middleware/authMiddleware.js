

const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
      id: user.id,
      role: user.role,
      phone: user.phone,
    };

    next();
  } catch (err) {
    console.error("auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};

function allowAdmin(req, res, next) {
  if (req.user.role !== "OWNER") {
    return res.status(403).json({ message: "Access restricted to platform owner" });
  }
  next();
}

module.exports = {
  auth,
  allowRoles,
  allowAdmin,
};