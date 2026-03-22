const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  adminListShops,
  adminUpdateShopStatus,
  adminUpdateShopConfig
} = require("../controllers/shopController");

const router = express.Router();

// Only OWNER and MANAGER allowed
router.use(auth, allowRoles("OWNER", "MANAGER"));

router.get("/", adminListShops);

router.patch("/:id/status", adminUpdateShopStatus);

router.patch("/:id/config", adminUpdateShopConfig);

module.exports = router;
