const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
  registerShop,
  getMyShop,
  getNearbyShops,
  getShopPublicDetails
} = require("../controllers/shopController");
const { getPublicMenuForShop } = require("../controllers/menuController");

const router = express.Router();

// Nearby shops (public)
router.get("/nearby", getNearbyShops);

// Public shop details
router.get("/:id/public", getShopPublicDetails);

// Public menu for a shop
router.get("/:shopId/menu", getPublicMenuForShop);

// Register new shop
router.post("/", auth, registerShop);

// Get my shop
router.get("/my", auth, getMyShop);

module.exports = router;