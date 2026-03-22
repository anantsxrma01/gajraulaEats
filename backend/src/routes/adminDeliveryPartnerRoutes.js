const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { allowAdmin } = require("../middleware/authMiddleware");
const {
  getAllDeliveryPartners,
  getDeliveryPartnerDetails,
  updateDeliveryPartnerStatus,
  getDeliveryPartnerOrders
} = require("../controllers/adminDeliveryPartnerController");

const router = express.Router();

router.use(auth, allowAdmin);

// List with filters
router.get("/", getAllDeliveryPartners);

// Single partner details
router.get("/:id", getDeliveryPartnerDetails);

// Status update (ACTIVE / INACTIVE / PENDING / BANNED)
router.patch("/:id/status", updateDeliveryPartnerStatus);

// Orders of partner
router.get("/:id/orders", getDeliveryPartnerOrders);

module.exports = router;
