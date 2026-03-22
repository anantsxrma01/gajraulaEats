const Shop = require("../models/Shop");
const User = require("../models/User");

// GET ALL SHOPS (with filter)
const getAllShops = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const shops = await Shop.find(query)
      .populate("owner_user_id", "phone");

    res.json({
      success: true,
      shops,
    });
  } catch (err) {
    console.error("getAllShops error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE SHOP
const approveShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.status = "APPROVED";
    shop.is_open = true; // optional
    await shop.save();

    res.json({
      success: true,
      shop,
      message: "Shop approved successfully",
    });
  } catch (err) {
    console.error("approveShop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REJECT SHOP
const rejectShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.status = "REJECTED";
    shop.rejection_reason = reason || "Not specified";
    await shop.save();

    res.json({
      success: true,
      shop,
      message: "Shop rejected",
    });
  } catch (err) {
    console.error("rejectShop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SUSPEND SHOP (for violations)
const suspendShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.status = "SUSPENDED";
    shop.is_open = false;
    await shop.save();

    res.json({
      success: true,
      shop,
      message: "Shop suspended",
    });
  } catch (err) {
    console.error("suspendShop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllShops,
  approveShop,
  rejectShop,
  suspendShop,
};
