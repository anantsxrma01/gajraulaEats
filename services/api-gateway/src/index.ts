import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[api-gateway] ${req.method} ${req.originalUrl}`);
  next();
});

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// 🔑 NO pathRewrite — forward as-is
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    secure: true,
    proxyTimeout: 30000,   // ⏱️ cold start tolerate
    timeout: 30000,
    onProxyReq: (proxyReq, req) => {
      console.log("➡️ Forwarding:", AUTH_SERVICE_URL + req.originalUrl);
    },
    onError: (err, _req, res) => {
      console.error("❌ Proxy error:", err.message);
      res.status(502).send("Bad Gateway");
    },
  })
);

app.get("/", (_req, res) => {
  res.send("API Gateway running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});