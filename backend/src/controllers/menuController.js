const Shop = require("../models/Shop");
const Category = require("../models/Category");
const Item = require("../models/Item");

// Helper: ensure logged-in user owns this shop (or is OWNER)
async function ensureOwnerHasShop(req) {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole === "OWNER") {
    // OWNER sab shops access kar sakta hai, but usually UI se specific select karega
    return null;
  }

  // For SHOP_OWNER, find their shop
  const shop = await Shop.findOne({ owner_user_id: userId });

  if (!shop) {
    const err = new Error("No shop found for this user");
    err.code = "NO_SHOP";
    throw err;
  }

  return shop;
}

/* -------------------- CATEGORY APIs (SHOP OWNER) -------------------- */

// POST /api/shop-owner/categories
const createCategory = async (req, res) => {
  try {
    const userRole = req.user.role;
    let { shop_id, name, sort_order } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // If SHOP_OWNER, force shop_id from their shop
    if (userRole === "SHOP_OWNER") {
      const shop = await ensureOwnerHasShop(req);
      shop_id = shop._id;
    }

    if (!shop_id) {
      return res.status(400).json({ message: "shop_id is required" });
    }

    const category = await Category.create({
      shop_id,
      name,
      sort_order
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    console.error("createCategory error:", err);
    if (err.code === "NO_SHOP") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/shop-owner/categories
const listMyCategories = async (req, res) => {
  try {
    const userRole = req.user.role;
    let { shop_id } = req.query;

    if (userRole === "SHOP_OWNER") {
      const shop = await ensureOwnerHasShop(req);
      shop_id = shop._id.toString();
    }

    if (!shop_id) {
      return res.status(400).json({ message: "shop_id is required" });
    }

    const categories = await Category.find({
      shop_id,
      is_active: true
    }).sort({ sort_order: 1, createdAt: 1 });

    res.json({ success: true, categories });
  } catch (err) {
    console.error("listMyCategories error:", err);
    if (err.code === "NO_SHOP") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/shop-owner/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sort_order, is_active } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // (Optional) ensure user owns the same shop – SKIP for now, मान रहे हो कि frontend सही id देगा

    if (name != null) category.name = name;
    if (sort_order != null) category.sort_order = sort_order;
    if (is_active != null) category.is_active = is_active;

    await category.save();

    res.json({ success: true, category });
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/shop-owner/categories/:id (soft-delete: is_active=false)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.is_active = false;
    await category.save();

    // Optionally, items under this category ko unavailable kar do
    await Item.updateMany(
      { category_id: id },
      { $set: { is_available: false } }
    );

    res.json({ success: true, message: "Category deactivated and items disabled" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- ITEM APIs (SHOP OWNER) -------------------- */

// POST /api/shop-owner/items
const createItem = async (req, res) => {
  try {
    const userRole = req.user.role;
    let {
      shop_id,
      category_id,
      name,
      description,
      price,
      is_veg,
      in_stock,
      is_available,
      image_url,
      tags,
      preparation_time_minutes
    } = req.body;

    if (!name || price == null || !category_id) {
      return res
        .status(400)
        .json({ message: "name, price and category_id are required" });
    }

    if (userRole === "SHOP_OWNER") {
      const shop = await ensureOwnerHasShop(req);
      shop_id = shop._id;
    }

    if (!shop_id) {
      return res.status(400).json({ message: "shop_id is required" });
    }

    const item = await Item.create({
      shop_id,
      category_id,
      name,
      description,
      price,
      is_veg,
      in_stock,
      is_available,
      image_url,
      tags,
      preparation_time_minutes
    });

    res.status(201).json({ success: true, item });
  } catch (err) {
    console.error("createItem error:", err);
    if (err.code === "NO_SHOP") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/shop-owner/items
const listMyItems = async (req, res) => {
  try {
    const userRole = req.user.role;
    let { shop_id, category_id } = req.query;

    if (userRole === "SHOP_OWNER") {
      const shop = await ensureOwnerHasShop(req);
      shop_id = shop._id.toString();
    }

    if (!shop_id) {
      return res.status(400).json({ message: "shop_id is required" });
    }

    const filter = {
      shop_id,
      is_deleted: false
    };

    if (category_id) {
      filter.category_id = category_id;
    }

    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .populate("category_id", "name");

    res.json({ success: true, items });
  } catch (err) {
    console.error("listMyItems error:", err);
    if (err.code === "NO_SHOP") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/shop-owner/items/:id
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item || item.is_deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatableFields = [
      "name",
      "description",
      "price",
      "is_veg",
      "in_stock",
      "is_available",
      "image_url",
      "tags",
      "preparation_time_minutes",
      "category_id"
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] != null) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    console.error("updateItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/shop-owner/items/:id  (soft-delete)
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item || item.is_deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.is_deleted = true;
    item.is_available = false;
    item.in_stock = false;
    await item.save();

    res.json({ success: true, message: "Item deleted (soft)" });
  } catch (err) {
    console.error("deleteItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- USER-SIDE PUBLIC MENU -------------------- */

// GET /api/shops/:shopId/menu
const getPublicMenuForShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId).select("status is_open name");
    if (!shop || shop.status !== "APPROVED") {
      return res.status(404).json({ message: "Shop not found or not approved" });
    }

    // Active categories
    const categories = await Category.find({
      shop_id: shopId,
      is_active: true
    }).sort({ sort_order: 1, createdAt: 1 });

    const categoryIds = categories.map((c) => c._id);

    // Items under these categories
    const items = await Item.find({
      shop_id: shopId,
      category_id: { $in: categoryIds },
      is_deleted: false,
      is_available: true,
      in_stock: true
    }).sort({ createdAt: 1 });

    // Group by category
    const menu = categories.map((cat) => {
      const catItems = items.filter(
        (item) => item.category_id.toString() === cat._id.toString()
      );
      return {
        category_id: cat._id,
        category_name: cat.name,
        items: catItems
      };
    });

    res.json({
      success: true,
      shop: {
        id: shop._id,
        name: shop.name,
        is_open: shop.is_open
      },
      menu
    });
  } catch (err) {
    console.error("getPublicMenuForShop error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  // shop-owner side
  createCategory,
  listMyCategories,
  updateCategory,
  deleteCategory,
  createItem,
  listMyItems,
  updateItem,
  deleteItem,

  // user side
  getPublicMenuForShop
};
