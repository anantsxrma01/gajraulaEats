const express = require("express");
const {
  createAddress,
  getMyAddresses,
  setDefaultAddress,
  checkServiceArea
} = require("../controllers/addressController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

// Create address (requires login)
router.post("/", auth, createAddress);

// List my addresses
router.get("/", auth, getMyAddresses);

// Set default address
router.patch("/:id/default", auth, setDefaultAddress);

// Public check: given lat/lng, serviceable or not (user might not be logged in)
router.post("/check-service", checkServiceArea);

module.exports = router;
