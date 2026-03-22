const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets
} = require("../controllers/managementTicketController");

const router = express.Router();

router.post("/", auth, createTicket);
router.get("/my", auth, getMyTickets);

module.exports = router;
