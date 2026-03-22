// backend/src/server.js

require("dotenv").config();
console.log("ENV at startup:", {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route modules
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const shopRoutes = require("./routes/shopRoutes");

// 👇 नाम बदल दिया: adminShopRouter (ताकि adminShopRoutes का duplicate issue खत्म हो जाए)
const adminShopRouter = require("./routes/adminShopRoutes");

const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shopOwnerOrderRoutes = require("./routes/shopOwnerOrderRoutes");
const deliveryPartnerRoutes = require("./routes/deliveryPartnerRoutes");
const testRoutes = require("./routes/testRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminPayoutRoutes = require("./routes/adminPayoutRoutes");
const shopEarningRoutes = require("./routes/shopEarningRoutes");
const partnerEarningRoutes = require("./routes/partnerEarningRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");
const orderStreamRoutes = require("./routes/orderStreamRoutes");
const adminDeliveryPartnerRoutes = require("./routes/adminDeliveryPartnerRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");

const managementOrderRoutes = require("./routes/managementOrderRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const managementTicketRoutes = require("./routes/managementTicketRoutes");

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "FDS Backend running" });
});

app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "FDS Backend API is LIVE! Access endpoints via /api/..." });
});

// (optional debug logs hata sakte ho)
console.log("authRoutes type:", typeof authRoutes);
console.log("authRoutes value:", authRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/shops", shopRoutes);

// यहाँ भी नया नाम use किया है
app.use("/api/admin/shops", adminShopRouter);

app.use("/api/test", testRoutes);
app.use("/api/shop-owner/menu", menuRoutes);

// ❌ तुमने ये दो बार लगाया था, मैं एक ही बार रख रहा हूँ
app.use("/api/orders", orderRoutes);

// अगर orderStreamRoutes में भी /api/orders base चाहिये,
// तो अंदर routes में अलग path use करना बेहतर है,
// लेकिन अभी के लिए ये ठीक चलेगा:
app.use("/api/orders", orderStreamRoutes);

app.use("/api/shop-owner/orders", shopOwnerOrderRoutes);
app.use("/api/delivery-partner", deliveryPartnerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/payouts", adminPayoutRoutes);
app.use("/api/shop-owner/earnings", shopEarningRoutes);
app.use("/api/partner/earnings", partnerEarningRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/admin/delivery-partners", adminDeliveryPartnerRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

app.use("/api/management", managementOrderRoutes);       // /orders, /orders/:id...
app.use("/api/tickets", ticketRoutes);                   // user tickets
app.use("/api/management/tickets", managementTicketRoutes);

// Port
const PORT = process.env.PORT || 5001;

// DB connect then start server
console.log("Starting server...");
console.log("MONGO URI:", process.env.MONGODB_URI);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});