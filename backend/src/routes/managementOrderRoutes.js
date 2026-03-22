const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  listOrdersForManagement,
  getOrderDetailForManagement,
  overrideOrderStatus,
  reassignDeliveryPartner
} = require("../controllers/managementOrderController");

const router = express.Router();

router.use(auth, allowRoles("OWNER", "MANAGER"));

router.get("/orders", listOrdersForManagement);
router.get("/orders/:id", getOrderDetailForManagement);
router.patch("/orders/:id/status", overrideOrderStatus);
router.patch("/orders/:id/reassign-rider", reassignDeliveryPartner);

module.exports = router;
