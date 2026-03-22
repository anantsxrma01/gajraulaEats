const express = require("express");
const { auth, allowRoles } = require("../middleware/authMiddleware");
const {
  createCategory,
  listMyCategories,
  updateCategory,
  deleteCategory,
  createItem,
  listMyItems,
  updateItem,
  deleteItem
} = require("../controllers/menuController");

const router = express.Router();

// Shop Owner / Owner only
router.use(auth, allowRoles("SHOP_OWNER", "OWNER"));

// Categories
router.post("/categories", createCategory);
router.get("/categories", listMyCategories);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Items
router.post("/items", createItem);
router.get("/items", listMyItems);
router.patch("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

module.exports = router;
