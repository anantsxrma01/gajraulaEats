const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { allowAdmin } = require("../middleware/authMiddleware");
const {
  getOverviewStats,
  getDailyOrderStats,
  getTopShopsStats,
  getTopItemsStats
} = require("../controllers/adminStatsController");

const router = express.Router();

router.use(auth, allowAdmin);

router.get("/overview", getOverviewStats);
router.get("/daily", getDailyOrderStats);
router.get("/top-shops", getTopShopsStats);
router.get("/top-items", getTopItemsStats);

module.exports = router;