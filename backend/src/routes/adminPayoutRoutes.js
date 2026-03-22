// backend/src/routes/adminPayoutRoutes.js

const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  listPayouts,
  getPayoutDetail,
  markPayoutPaid
} = require("../controllers/adminPayoutController");

const router = express.Router();

// Sirf OWNER / MANAGER ko access
router.use(auth, allowRoles("OWNER", "MANAGER"));

// List payouts
router.get("/", listPayouts);

// Payout detail
router.get("/:id", getPayoutDetail);

// Mark payout as paid
router.patch("/:id/mark-paid", markPayoutPaid);

module.exports = router;