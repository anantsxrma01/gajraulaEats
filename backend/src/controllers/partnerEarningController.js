// backend/src/controllers/partnerEarningController.js

const Order = require("../models/Order");
const DeliveryPartner = require("../models/DeliveryPartner");

/**
 * Simple earning rule:
 * - per delivered order: base 20 + 5 * distance_km
 * You can change this logic later.
 */
function calculatePartnerEarningForOrder(order) {
  const base = 20;
  const perKm = 5;
  const distance = order.distance_km || 0;
  return base + perKm * distance;
}

/**
 * GET /api/partner/earnings/me
 * Role: DELIVERY_PARTNER
 * Returns summary + list of delivered orders with earning per order.
 */
const getMyEarnings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find partner document for this user
    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }

    // All delivered orders for this partner
    const orders = await Order.find({
      delivery_partner_id: partner._id,
      order_status: "DELIVERED"
    }).sort({ createdAt: -1 });

    let totalEarning = 0;

    const ordersWithEarning = orders.map((order) => {
      const earning = calculatePartnerEarningForOrder(order);
      totalEarning += earning;
      return {
        _id: order._id,
        order_number: order.order_number,
        createdAt: order.createdAt,
        distance_km: order.distance_km,
        total_amount: order.total_amount,
        earning
      };
    });

    res.json({
      success: true,
      partner: {
        id: partner._id,
        total_trips: partner.total_trips,
        status: partner.status
      },
      summary: {
        total_earning: totalEarning,
        total_delivered_orders: orders.length
      },
      orders: ordersWithEarning
    });
  } catch (err) {
    console.error("getMyEarnings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/partner/earnings/all
 * Role: OWNER / MANAGER
 * Returns earning summary per partner.
 */
const getAllPartnersEarningsSummary = async (req, res) => {
  try {
    // All delivered orders with a partner
    const orders = await Order.find({
      delivery_partner_id: { $ne: null },
      order_status: "DELIVERED"
    }).populate("delivery_partner_id", "user_id status");

    const map = new Map();

    for (const order of orders) {
      const partner = order.delivery_partner_id;
      if (!partner) continue;

      const partnerId = String(partner._id);
      const earning = calculatePartnerEarningForOrder(order);

      if (!map.has(partnerId)) {
        map.set(partnerId, {
          partner_id: partnerId,
          user_id: partner.user_id,
          status: partner.status,
          total_earning: 0,
          total_orders: 0
        });
      }

      const entry = map.get(partnerId);
      entry.total_earning += earning;
      entry.total_orders += 1;
    }

    const summary = Array.from(map.values());

    res.json({
      success: true,
      count: summary.length,
      partners: summary
    });
  } catch (err) {
    console.error("getAllPartnersEarningsSummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyEarnings,
  getAllPartnersEarningsSummary
};