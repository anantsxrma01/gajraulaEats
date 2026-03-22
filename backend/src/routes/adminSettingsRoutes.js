const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const { getSettings, updateSettings } = require("../controllers/adminSettingsController");

const router = express.Router();

// OWNER only
router.use(auth, allowRoles("OWNER"));

router.get("/", getSettings);
router.patch("/", updateSettings);

module.exports = router;
