const Order = require("../models/Order");
const DeliveryPartner = require("../models/DeliveryPartner");
const { logOrderAction } = require("../utils/orderLog");

// GET /api/management/orders
// filters: status, shop_id, user_phone, from_date, to_date, limit
const listOrdersForManagement = async (req, res) => {
  try {
    const {
      status,
      shop_id,
      user_phone,
      from_date,
      to_date,
      limit = 50
    } = req.query;

    const query = {};

    if (status) query.order_status = status;
    if (shop_id) query.shop_id = shop_id;

    if (from_date || to_date) {
      query.createdAt = {};
      if (from_date) query.createdAt.$gte = new Date(from_date);
      if (to_date) query.createdAt.$lte = new Date(to_date);
    }

    let orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("user_id", "phone")
      .populate("shop_id", "name")
      .populate("delivery_partner_id");

    // Filter by user_phone in memory
    if (user_phone) {
      orders = orders.filter(
        (o) => o.user_id && o.user_id.phone === user_phone
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("listOrdersForManagement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/management/orders/:id
const getOrderDetailForManagement = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user_id", "phone name")
      .populate("shop_id", "name")
      .populate("address_id")
      .populate("delivery_partner_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("getOrderDetailForManagement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/management/orders/:id/status
const overrideOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_status, note } = req.body;

    const allowed = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "ASSIGNED",
      "PICKED",
      "DELIVERED",
      "CANCELLED"
    ];
    if (!allowed.includes(new_status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const fromStatus = order.order_status;
    order.order_status = new_status;

    if (new_status === "CANCELLED" && !order.timeline.cancelled_at) {
      order.timeline.cancelled_at = new Date();
      order.cancellation_reason = note || "Cancelled by management";
    }

    await order.save();

    await logOrderAction({
      order_id: order._id,
      actor_user_id: req.user.id,
      actor_role: req.user.role,
      action_type: "STATUS_CHANGE",
      from_status: fromStatus,
      to_status: new_status,
      note
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("overrideOrderStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/management/orders/:id/reassign-rider
const reassignDeliveryPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id, note } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const fromPartner = order.delivery_partner_id;

    let toPartner = null;
    if (partner_id) {
      toPartner = await DeliveryPartner.findById(partner_id);
      if (!toPartner || toPartner.status !== "ACTIVE") {
        return res.status(400).json({ message: "Invalid delivery partner" });
      }
    }

    order.delivery_partner_id = toPartner ? toPartner._id : undefined;

    // अगर नया rider assign किया तो कम से कम ASSIGNED state में ला दो
    if (toPartner && !["ASSIGNED", "PICKED"].includes(order.order_status)) {
      order.order_status = "ASSIGNED";
      order.timeline.assigned_at = new Date();
    }

    await order.save();

    await logOrderAction({
      order_id: order._id,
      actor_user_id: req.user.id,
      actor_role: req.user.role,
      action_type: partner_id ? "RIDER_ASSIGN" : "RIDER_UNASSIGN",
      note,
      extra: {
        from_partner: fromPartner,
        to_partner: toPartner ? toPartner._id : null
      }
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("reassignDeliveryPartner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listOrdersForManagement,
  getOrderDetailForManagement,
  overrideOrderStatus,
  reassignDeliveryPartner
};
