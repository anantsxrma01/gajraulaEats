// backend/src/routes/testRoutes.js

const express = require("express");
const router = express.Router();

// Simple test route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Test route working correctly",
    time: new Date().toISOString()
  });
});

// Another example test route
router.get("/ping", (req, res) => {
  res.json({ pong: true });
});

module.exports = router;   // 👈 IMPORTANT