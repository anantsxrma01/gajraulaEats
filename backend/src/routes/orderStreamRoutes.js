const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const { addSubscriber, removeSubscriber } = require("../utils/orderEventStream");

const router = express.Router();

// GET /api/orders/:id/stream?token=JWT_TOKEN
router.get("/:id/stream", async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(401).end();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).end();
    }

    const userId = decoded.userId;

    // Check that this order belongs to this user
    const order = await Order.findOne({ _id: id, user_id: userId });
    if (!order) {
      return res.status(404).end();
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.(); // अगर compression middleware हो तो

    // Immediately send initial event (optional)
    res.write(`event: orderUpdate\n`);
    res.write(
      `data: ${JSON.stringify({ type: "INIT", order })}\n\n`
    );

    // Register subscriber
    addSubscriber(id, res);

    // Clean up on client disconnect
    req.on("close", () => {
      removeSubscriber(id, res);
      res.end();
    });
  } catch (err) {
    console.error("order stream error:", err);
    // SSE responses में error भेजना tricky है, बस close कर देते हैं
    try {
      res.end();
    } catch {}
  }
});

module.exports = router;
