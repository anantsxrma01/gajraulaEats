const SupportTicket = require("../models/SupportTicket");

// USER: POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id, type, subject, description, priority } = req.body;

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    const ticket = await SupportTicket.create({
      created_by_user_id: userId,
      order_id,
      type,
      subject,
      description,
      priority
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error("createTicket error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// USER: GET /api/tickets/my
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await SupportTicket.find({ created_by_user_id: userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, tickets });
  } catch (err) {
    console.error("getMyTickets error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// MANAGEMENT: GET /api/management/tickets
const listTicketsForManagement = async (req, res) => {
  try {
    const { status, priority, limit = 50 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("created_by_user_id", "phone name")
      .populate("order_id", "order_number order_status");

    res.json({ success: true, tickets });
  } catch (err) {
    console.error("listTicketsForManagement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// MANAGEMENT: PATCH /api/management/tickets/:id
const updateTicketForManagement = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_to_user_id, note } = req.body;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assigned_to_user_id !== undefined) {
      ticket.assigned_to_user_id = assigned_to_user_id;
    }
    if (note) {
      ticket.internal_notes.push({
        user_id: req.user.id,
        note
      });
    }

    await ticket.save();

    res.json({ success: true, ticket });
  } catch (err) {
    console.error("updateTicketForManagement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  listTicketsForManagement,
  updateTicketForManagement
};
