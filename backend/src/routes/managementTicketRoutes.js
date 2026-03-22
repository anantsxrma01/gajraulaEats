const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  listTicketsForManagement,
  updateTicketForManagement
} = require("../controllers/managementTicketController");

const router = express.Router();

router.use(auth, allowRoles("OWNER", "MANAGER"));

router.get("/", listTicketsForManagement);
router.patch("/:id", updateTicketForManagement);

module.exports = router;
