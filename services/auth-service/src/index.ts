import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Auth Service is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);

// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✓ Auth Service running on port ${PORT}`);
});