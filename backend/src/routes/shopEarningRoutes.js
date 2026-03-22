// src/routes/shopEarningRoutes.js
const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const { getMyShopEarnings } = require("../controllers/shopEarningController");

const router = express.Router();

router.get("/my", auth, allowRoles("SHOP_OWNER"), getMyShopEarnings);

module.exports = router;