import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------
// MIDDLEWARES
// ------------------
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[api-gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------
// SERVICE URLS (IMPORTANT)
// ------------------

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// ------------------
// ROUTES (NO pathRewrite)
// ------------------

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/api/auth": "/api/auth",
    },

    onProxyReq(proxyReq, req, res) {
      console.log("➡️ Forwarding to:", AUTH_SERVICE_URL + req.url);
    },

    onError(err, req, res) {
      console.error("❌ Proxy error:", err.message);
    },
  })
);

// ------------------
// HEALTH CHECK
// ------------------
app.get("/", (_req, res) => {
  res.send("API Gateway running 🚀");
});

// ------------------
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});