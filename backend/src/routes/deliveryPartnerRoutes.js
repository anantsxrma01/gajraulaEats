const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  registerDeliveryPartner,
  getMyPartnerProfile,
  setOnlineStatus,
  updateLocation,
  getMyAssignedOrders,
  markOrderPicked,
  markOrderDelivered,
  rejectAssignedOrder,
} = require("../controllers/deliveryPartnerController");

const router = express.Router();

// Register as delivery partner (any logged-in user)
router.post("/register", auth, registerDeliveryPartner);

// Baaki routes sirf DELIVERY_PARTNER role ke liye
router.use(auth, allowRoles("DELIVERY_PARTNER"));

// Profile
router.get("/me", getMyPartnerProfile);

// Online / offline
router.patch("/status", setOnlineStatus);

// Location update
router.post("/location", updateLocation);

// Assigned orders
router.get("/orders", getMyAssignedOrders);

// Pick & deliver
router.patch("/orders/:id/pick", markOrderPicked);
router.patch("/orders/:id/deliver", markOrderDelivered);
router.patch("/orders/:id/reject", rejectAssignedOrder);

module.exports = router;
