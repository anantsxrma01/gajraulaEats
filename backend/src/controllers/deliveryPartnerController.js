// backend/src/controllers/deliveryPartnerController.js

const DeliveryPartner = require("../models/DeliveryPartner");
const User = require("../models/User");
const Order = require("../models/Order");
const {
  notifyOrderStatusChangedForUser,
  notifyOrderStatusChangedForDeliveryPartner
} = require("../services/notificationService");
const { sendOrderUpdate } = require("../utils/orderEventStream");
const ShopEarning = require("../models/ShopEarning");
const PartnerEarning = require("../models/PartnerEarning");
const { calculateShopEarning, calculatePartnerEarning } = require("../utils/earningHelpers");
const Shop = require("../models/Shop");
const fraudService = require("../services/fraudService");

// अगर नीचे autoAssignDeliveryPartner में mongoose use कर रहे हो तो ये भी add कर दो:
const mongoose = require("mongoose");



// Helper: frequent rejection rule (simple version)
async function handleFrequentRejectionRule(partner) {
  try {
    const totalRejects = partner.rejected_assignments || 0;
    const THRESHOLD = 10;

    if (totalRejects >= THRESHOLD) {
      await fraudService.raiseFraudFlag({
        entity_type: "DELIVERY_PARTNER",
        entity_id: partner._id,
        type: "FREQUENT_REJECTION",
        severity: 2,
        risk_points: 10,
        message: `Partner has rejected ${totalRejects} orders till now`
      });
    }
  } catch (err) {
    console.error("handleFrequentRejectionRule error:", err);
  }
}

// Helper: auto-assign nearest online delivery partner to an order
// options: { excludePartnerId?: ObjectId/string, maxDistanceMeters?: number }
async function autoAssignDeliveryPartner(orderId, options = {}) {
  try {
    const { excludePartnerId, maxDistanceMeters = 7000 } = options;

    // 1) Order load करो
    const order = await Order.findById(orderId);

    if (!order) {
      console.warn("autoAssignDeliveryPartner: order not found", orderId);
      return null;
    }

    // Already assigned या final status में है तो kuch mat karo
    if (
      order.delivery_partner_id ||
      ["DELIVERED", "CANCELLED"].includes(order.order_status)
    ) {
      return null;
    }

    // 2) Shop ki location lo
    const shop = await Shop.findById(order.shop_id);

    if (!shop || !shop.address || !shop.address.location) {
      console.warn("autoAssignDeliveryPartner: shop or location missing", order.shop_id);
      return null;
    }

    const [shopLng, shopLat] = shop.address.location.coordinates;

    // 3) Query build karo: ACTIVE + online + nearby
    const dpFilter = {
      status: "ACTIVE",
      is_online: true,
      "current_location.coordinates": { $ne: [0, 0] } // avoid default(0,0) if any
    };

    if (excludePartnerId) {
      dpFilter._id = {
        $ne: new mongoose.Types.ObjectId(excludePartnerId)
      };
    }

    // 4) Nearest partner find karo (Mongo $near)
    const partner = await DeliveryPartner.findOne({
      ...dpFilter,
      current_location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [shopLng, shopLat]
          },
          $maxDistance: maxDistanceMeters // e.g. 7km
        }
      }
    });

    if (!partner) {
      // koi online rider nahi mila given radius me
      console.log("autoAssignDeliveryPartner: no partner found for order", orderId);
      // order ko PENDING_ASSIGNMENT / READY_FOR_PICKUP state me hi rehne do
      return null;
    }

    // 5) Order ko assign karo
    order.delivery_partner_id = partner._id;
    order.order_status = "ASSIGNED";
    order.timeline = order.timeline || {};
    order.timeline.assigned_at = new Date();

    await order.save();

    // Partner ki last_active_at bhi update kar do (optional)
    partner.last_active_at = new Date();
    await partner.save();

    console.log(
      `autoAssignDeliveryPartner: order ${orderId} assigned to partner ${partner._id}`
    );

    return partner;
  } catch (err) {
    console.error("autoAssignDeliveryPartner error:", err);
    return null;
  }
}


// ----------------------------------------
// REGISTER DELIVERY PARTNER
// ----------------------------------------
const registerDeliveryPartner = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicle_type } = req.body;

    let partner = await DeliveryPartner.findOne({ user_id: userId });

    if (partner) {
      return res.json({
        success: true,
        partner,
        message: "Delivery partner profile already exists."
      });
    }

    partner = await DeliveryPartner.create({
      user_id: userId,
      vehicle_type: vehicle_type || "BIKE",
      status: "ACTIVE"
    });

    await User.findByIdAndUpdate(userId, { role: "DELIVERY_PARTNER" });

    res.status(201).json({
      success: true,
      partner,
      message: "Registered as delivery partner."
    });
  } catch (err) {
    console.error("registerDeliveryPartner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// GET PROFILE
// ----------------------------------------
const getMyPartnerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }

    res.json({ success: true, partner });
  } catch (err) {
    console.error("getMyPartnerProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// ONLINE / OFFLINE STATUS
// ----------------------------------------
const setOnlineStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { is_online, lat, lng } = req.body;

    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    if (partner.status === "BANNED") {
      return res.status(403).json({ message: "Partner is banned" });
    }

    partner.is_online = !!is_online;

    if (lat != null && lng != null) {
      partner.current_location = {
        type: "Point",
        coordinates: [lng, lat]
      };
    }

    partner.last_active_at = new Date();

    if (partner.status !== "ACTIVE") {
      partner.is_online = false;
    }

    await partner.save();

    res.json({ success: true, partner });
  } catch (err) {
    console.error("setOnlineStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// UPDATE LOCATION
// ----------------------------------------
const updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    partner.current_location = {
      type: "Point",
      coordinates: [lng, lat]
    };
    partner.last_active_at = new Date();

    await partner.save();

    res.json({ success: true, partner });
  } catch (err) {
    console.error("updateLocation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// GET ASSIGNED ORDERS
// ----------------------------------------
const getMyAssignedOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    const { status } = req.query;
    const filter = { delivery_partner_id: partner._id };

    if (status) {
      filter.order_status = status;
    } else {
      filter.order_status = { $in: ["ASSIGNED", "PICKED"] };
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("shop_id", "name address")
      .populate("address_id", "line1 city");

    res.json({ success: true, orders });
  } catch (err) {
    console.error("getMyAssignedOrders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// MARK AS PICKED
// ----------------------------------------
const markOrderPicked = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const partner = await DeliveryPartner.findOne({ user_id: userId });
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    const order = await Order.findOne({
      _id: id,
      delivery_partner_id: partner._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found for this partner" });
    }

    if (!["ASSIGNED", "READY_FOR_PICKUP"].includes(order.order_status)) {
      return res
        .status(400)
        .json({ message: "Order cannot be marked picked at this stage" });
    }

    order.order_status = "PICKED";
    order.timeline.picked_at = new Date();
    await order.save();
    sendOrderUpdate(order);

    // Notifications
    try {
      await notifyOrderStatusChangedForDeliveryPartner({
        order,
        newStatus: "PICKED"
      });
    } catch (e) {
      console.error("notifyOrderStatusChangedForDeliveryPartner error:", e.message);
    }

    try {
      await notifyOrderStatusChangedForUser({
        order,
        newStatus: "PICKED"
      });
    } catch (e) {
      console.error("notifyOrderStatusChangedForUser error:", e.message);
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("markOrderPicked error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// MARK AS DELIVERED
// ----------------------------------------
const markOrderDelivered = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    const order = await Order.findOne({
      _id: id,
      delivery_partner_id: partner._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found for this partner" });
    }

    if (order.order_status !== "PICKED") {
      return res.status(400).json({
        message: `Order cannot be marked delivered from status ${order.order_status}`
      });
    }

    // 1. Update order status & payment
    order.order_status = "DELIVERED";
    order.timeline.delivered_at = new Date();

    if (order.payment_mode === "COD" && order.payment_status === "PENDING") {
      order.payment_status = "SUCCESS";
    }

    // 2. Update partner stats
    partner.total_trips = (partner.total_trips || 0) + 1;

    // 3. Create earnings if not already created
    const existingShopEarning = await ShopEarning.findOne({ order_id: order._id });
    const existingPartnerEarning = await PartnerEarning.findOne({ order_id: order._id });

    const shop = await Shop.findById(order.shop_id);

    if (!existingShopEarning && shop) {
      const shopCalc = calculateShopEarning({
        subTotal: order.sub_total,
        commissionPercent: shop.commission_percent
      });

      await ShopEarning.create({
        order_id: order._id,
        shop_id: order.shop_id,
        gross_amount: order.sub_total,
        commission_percent: shopCalc.commissionPercent,
        commission_amount: shopCalc.commissionAmount,
        net_payable: shopCalc.netPayable
      });
    }

    if (!existingPartnerEarning && partner) {
      const dpCalc = calculatePartnerEarning({
        distanceKm: order.distance_km
      });

      await PartnerEarning.create({
        order_id: order._id,
        delivery_partner_id: partner._id,
        base_amount: dpCalc.baseAmount,
        distance_km: order.distance_km,
        per_km_rate: dpCalc.perKmRate,
        variable_amount: dpCalc.variableAmount,
        total_earning: dpCalc.totalEarning
      });
    }

    await partner.save();
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("markOrderDelivered error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// REJECT ASSIGNED ORDER
// ---------------------------------------- 
// PATCH /api/delivery-partner/orders/:id/reject
const rejectAssignedOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // order id
    const { reason } = req.body;

    // 1) Partner find
    const partner = await DeliveryPartner.findOne({ user_id: userId });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    if (partner.status === "BANNED") {
      return res.status(403).json({ message: "You are banned from deliveries" });
    }

    // 2) Order verify: is order assigned to this partner?
    let order = await Order.findOne({
      _id: id,
      delivery_partner_id: partner._id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found for this partner or not assigned to you"
      });
    }

    if (order.order_status !== "ASSIGNED") {
      return res.status(400).json({
        message: `Order cannot be rejected from status ${order.order_status}`
      });
    }

    // 3) Partner rejection counters update
    partner.rejected_assignments = (partner.rejected_assignments || 0) + 1;
    partner.last_rejection_at = new Date();
    await partner.save();

    // 4) Order ko unassign + PENDING_ASSIGNMENT
    order.delivery_partner_id = null;
    order.order_status = "PENDING_ASSIGNMENT";

    if (reason) {
      // optional: internal note type field bana sakte ho
      order.internal_notes = `Last rider rejection reason: ${reason}`;
    }

    await order.save();

    // 5) Fraud rule
    await handleFrequentRejectionRule(partner);

    // 6) Auto reassign try karo (exclude current partner)
    const newPartner = await autoAssignDeliveryPartner(order._id, {
      excludePartnerId: partner._id
    });

    if (newPartner) {
      // updated order fetch
      order = await Order.findById(order._id);
      return res.json({
        success: true,
        message: "Order rejected. Reassigned to another partner.",
        order
      });
    }

    // koi naya rider nahi mila
    return res.json({
      success: true,
      message: "Order rejected. Pending new assignment.",
      order
    });
  } catch (err) {
    console.error("rejectAssignedOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// EXPORT CONTROLLER METHODS
// ----------------------------------------


module.exports = {
  registerDeliveryPartner,
  getMyPartnerProfile,
  setOnlineStatus,
  updateLocation,
  getMyAssignedOrders,
  markOrderPicked,
  markOrderDelivered,
  rejectAssignedOrder,

};