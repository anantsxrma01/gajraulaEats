/**
 * Management Approval Controller
 *
 * Routes:
 *   PATCH /api/management/approve/shops/:id/approve
 *   PATCH /api/management/approve/shops/:id/reject
 *   PATCH /api/management/approve/delivery/:id/approve
 *   PATCH /api/management/approve/delivery/:id/reject
 *   POST  /api/management/approve/employees  (create MANAGER)
 */

const User = require("../models/User");
const Shop = require("../models/Shop");
const DeliveryPartner = require("../models/DeliveryPartner");
const { normalizePhone } = require("../utils/phoneUtils");

// ── SHOP APPROVAL ─────────────────────────────────────────────────────────────

/** PATCH /management/approve/shops/:id/approve */
const approveShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.status = "APPROVED";
    shop.rejection_reason = undefined;
    await shop.save();

    // Sync user approvalStatus
    if (shop.owner_user_id) {
      await User.findByIdAndUpdate(shop.owner_user_id, {
        approvalStatus: "APPROVED",
        role: "SHOP_OWNER",
      });
    }

    console.log(`[Approval] Shop ${shop._id} approved by ${req.user?.id}`);
    res.json({ success: true, shop, message: "Shop approved successfully." });
  } catch (err) {
    console.error("approveShop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /management/approve/shops/:id/reject */
const rejectShop = async (req, res) => {
  try {
    const { reason } = req.body;
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.status = "REJECTED";
    shop.rejection_reason = reason || "Not specified";
    await shop.save();

    if (shop.owner_user_id) {
      await User.findByIdAndUpdate(shop.owner_user_id, { approvalStatus: "REJECTED" });
    }

    console.log(`[Approval] Shop ${shop._id} rejected by ${req.user?.id}`);
    res.json({ success: true, shop, message: "Shop rejected." });
  } catch (err) {
    console.error("rejectShop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── DELIVERY PARTNER APPROVAL ─────────────────────────────────────────────────

/** PATCH /management/approve/delivery/:id/approve */
const approveDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Delivery partner not found" });

    partner.status = "ACTIVE";
    await partner.save();

    if (partner.user_id) {
      await User.findByIdAndUpdate(partner.user_id, {
        role: "DELIVERY_PARTNER",
        approvalStatus: "APPROVED",
      });
    }

    console.log(`[Approval] DeliveryPartner ${partner._id} approved by ${req.user?.id}`);
    res.json({ success: true, partner, message: "Delivery partner approved." });
  } catch (err) {
    console.error("approveDeliveryPartner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /management/approve/delivery/:id/reject */
const rejectDeliveryPartner = async (req, res) => {
  try {
    const { reason } = req.body;
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Delivery partner not found" });

    partner.status = "BANNED";
    partner.is_online = false;
    await partner.save();

    if (partner.user_id) {
      await User.findByIdAndUpdate(partner.user_id, { approvalStatus: "REJECTED" });
    }

    console.log(`[Approval] DeliveryPartner ${partner._id} rejected by ${req.user?.id}`);
    res.json({ success: true, partner, message: "Delivery partner rejected." });
  } catch (err) {
    console.error("rejectDeliveryPartner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ── MANAGER CREATION (Owner creates without signup) ───────────────────────────

/** POST /management/approve/employees */
const createEmployee = async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const normalized = normalizePhone(phone);
    if (normalized.length !== 10) {
      return res.status(400).json({ message: "Invalid phone number. Must be 10 digits." });
    }

    // Upsert: if user exists, promote; if not, create
    let user = await User.findOne({ phone: normalized });

    if (user) {
      user.role = "MANAGER";
      user.approvalStatus = "APPROVED";
      user.createdBy = req.user.id;
      if (name) user.name = name;
      await user.save();
    } else {
      user = await User.create({
        phone: normalized,
        name: name || null,
        role: "MANAGER",
        approvalStatus: "APPROVED",
        status: "ACTIVE",
        createdBy: req.user.id,
      });
    }

    console.log(`[Employee] Manager created/updated: phone=${normalized} by ${req.user?.id}`);
    res.status(201).json({
      success: true,
      user: { id: user._id, phone: user.phone, role: user.role, approvalStatus: user.approvalStatus },
      message: "Manager account ready. They can now log in.",
    });
  } catch (err) {
    console.error("createEmployee error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  approveShop,
  rejectShop,
  approveDeliveryPartner,
  rejectDeliveryPartner,
  createEmployee,
};
