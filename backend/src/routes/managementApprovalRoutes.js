const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  approveShop,
  rejectShop,
  approveDeliveryPartner,
  rejectDeliveryPartner,
  createEmployee,
} = require("../controllers/managementApprovalController");

const router = express.Router();

// All approval routes require a logged-in OWNER or MANAGER
router.use(auth, allowRoles("OWNER", "MANAGER"));

// ── Shop approval ─────────────────────────────────────────────────────────────
router.patch("/shops/:id/approve", approveShop);
router.patch("/shops/:id/reject", rejectShop);

// ── Delivery partner approval ─────────────────────────────────────────────────
router.patch("/delivery/:id/approve", approveDeliveryPartner);
router.patch("/delivery/:id/reject", rejectDeliveryPartner);

// ── Create manager (owner only) ───────────────────────────────────────────────
router.post("/employees", allowRoles("OWNER"), createEmployee);

module.exports = router;
