const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

const router = express.Router();

// GET /api/notifications  (current user)
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.user.id,
      channel: "IN_APP"
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("list notifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      user_id: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.is_read = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (err) {
    console.error("mark notification read error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;