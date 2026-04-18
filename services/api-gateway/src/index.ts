import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[api-gateway] incoming ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------
// SERVICE URLS
// ------------------
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL!;

// ------------------
// AUTH ROUTE (ISOLATED)
// ------------------
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,

    // 🔥 VERY IMPORTANT
    pathRewrite: (path) => path,

    proxyTimeout: 60000,
    timeout: 60000,

    onProxyReq: (proxyReq, req) => {
      console.log(
        "➡️ Forwarding:",
        AUTH_SERVICE_URL + req.originalUrl
      );
    },

    onError: (err, _req, res) => {
      console.error("❌ Proxy error:", err.message);
      res.status(502).send("Bad Gateway");
    },
  })
);

app.get("/", (_req, res) => {
  res.send("Gateway running 🚀");
});

app.listen(PORT, () => {
  console.log(`Gateway running on ${PORT}`);
});