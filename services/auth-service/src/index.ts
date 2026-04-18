import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// ------------------
// GLOBAL ERROR HANDLING (VERY IMPORTANT)
// ------------------
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

// ------------------
// MIDDLEWARES
// ------------------
app.use(cors());
app.use(express.json());

// Request logger (debugging)
app.use((req, _res, next) => {
  console.log(`[auth-service] ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------
// HEALTH CHECK
// ------------------
app.get("/", (_req, res) => {
  res.send("Auth Service is running 🚀");
});

app.get("/health", (_req, res) => {
  res.send("OK");
});

// ------------------
// ROUTES
// ------------------
app.use("/api/auth", authRoutes);

// ------------------
// SERVER START
// ------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✓ Auth Service running on port ${PORT}`);
});