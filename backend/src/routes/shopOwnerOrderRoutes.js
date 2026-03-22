const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  getShopOrders,
  updateOrderStatusByShop
} = require("../controllers/orderController");

const router = express.Router();

// Only SHOP_OWNER and OWNER
router.use(auth, allowRoles("SHOP_OWNER", "OWNER"));

// List orders of this shop
router.get("/", getShopOrders);

// Update status
router.patch("/:id/status", updateOrderStatusByShop);

module.exports = router;
