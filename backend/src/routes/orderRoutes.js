const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getMyOrderDetail
} = require("../controllers/orderController");

const router = express.Router();

// Place order
router.post("/", auth, placeOrder);

// My orders
router.get("/my", auth, getMyOrders);

// My order detail
router.get("/:id", auth, getMyOrderDetail);

module.exports = router;