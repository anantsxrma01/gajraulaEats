// backend/src/server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// --------------------
// MIDDLEWARES
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "FDS Backend running 🚀" });
});

app.get("/api", (req, res) => {
  res.json({ status: "OK", message: "API LIVE ✅" });
});

// --------------------
// ROUTES
// --------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/shops", require("./routes/shopRoutes"));

app.use("/api/admin/shops", require("./routes/adminShopRoutes"));

app.use("/api/menu", require("./routes/menuRoutes"));

app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/orders/stream", require("./routes/orderStreamRoutes"));

app.use("/api/shop-owner/orders", require("./routes/shopOwnerOrderRoutes"));

app.use("/api/delivery", require("./routes/deliveryPartnerRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use("/api/admin/payouts", require("./routes/adminPayoutRoutes"));
app.use("/api/admin/stats", require("./routes/adminStatsRoutes"));
app.use("/api/admin/delivery-partners", require("./routes/adminDeliveryPartnerRoutes"));
app.use("/api/admin/settings", require("./routes/adminSettingsRoutes"));

app.use("/api/shop-owner/earnings", require("./routes/shopEarningRoutes"));
app.use("/api/partner/earnings", require("./routes/partnerEarningRoutes"));

app.use("/api/management/orders", require("./routes/managementOrderRoutes"));
app.use("/api/management/tickets", require("./routes/managementTicketRoutes"));
app.use("/api/management/approve", require("./routes/managementApprovalRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

// --------------------
// 404 HANDLER
// --------------------
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// --------------------
// GLOBAL ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });