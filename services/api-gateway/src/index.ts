import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// ------------------------
// MIDDLEWARES
// ------------------------

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[api-gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------------
// SERVICE URLS (RENDER)
// ------------------------

const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL,
  restaurants: process.env.RESTAURANT_SERVICE_URL,
  menu: process.env.MENU_SERVICE_URL,
  orders: process.env.ORDER_SERVICE_URL,
  delivery: process.env.DELIVERY_SERVICE_URL,
  payment: process.env.PAYMENT_SERVICE_URL,
  notify: process.env.NOTIFICATION_SERVICE_URL,
  admin: process.env.ADMIN_SERVICE_URL,
};

// ------------------------
// PROXY CONFIG
// ------------------------

const proxyOptions = (target: string) => ({
  target,
  changeOrigin: true,

  // 🔥 CRITICAL FIX (DO NOT REMOVE)
  pathRewrite: (path: string) => path,

  timeout: 10000,
  proxyTimeout: 10000,

  onError: (err: any, _req: any, res: any) => {
    console.error('Proxy Error:', err.message);
    res.status(500).json({
      message: 'Gateway Error',
      error: err.message,
    });
  },
});

// ------------------------
// ROUTES PROXY
// ------------------------

Object.entries(serviceUrls).forEach(([key, url]) => {
  if (!url) {
    console.warn(`⚠️ Missing URL for ${key}`);
    return;
  }

  console.log(`🔗 Routing /api/${key} → ${url}`);

  app.use(`/api/${key}`, createProxyMiddleware(proxyOptions(url)));
});

// ------------------------
// HEALTH CHECK
// ------------------------

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// ------------------------
// START SERVER
// ------------------------

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});