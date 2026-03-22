// backend/src/routes/partnerEarningRoutes.js

const express = require("express");
const router = express.Router();

// Stub / dummy routes for now so server doesn't crash.
// You can implement real earnings logic later.

// GET /api/partner/earnings/me
router.get("/me", (req, res) => {
  return res.json({
    success: true,
    message: "Partner earnings API not implemented yet."
  });
});

// GET /api/partner/earnings/all
router.get("/all", (req, res) => {
  return res.json({
    success: true,
    message: "All partners earnings API not implemented yet."
  });
});

module.exports = router;